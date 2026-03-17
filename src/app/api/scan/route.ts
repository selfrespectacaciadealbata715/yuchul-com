import { NextRequest, NextResponse } from 'next/server';
import { checkBreaches } from '@/lib/hibp';
import { Finding } from '@/lib/types';

interface ScanRequestBody {
  email: string;
  phone?: string;
  name?: string;
  username?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ScanRequestBody = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: '이메일이 필요합니다.',
        },
        { status: 400 }
      );
    }

    // Call the real XposedOrNot API
    const breachData = await checkBreaches(email);
    const findings: Finding[] = [];

    if (breachData && breachData.length > 0) {
      // Map breach data to Finding format
      findings.push(
        ...breachData.map((breach, index): Finding => ({
          id: `breach-${index}`,
          source: breach.name,
          type: '다크웹',
          dateFound: breach.breachDate,
          riskLevel: breach.riskLevel || '중간',
          exposedData: breach.dataClasses,
          description: breach.description,
          url: breach.domain ? `https://${breach.domain}` : undefined,
          status: 'new',
        }))
      );
    }

    // Calculate risk score (0-100)
    let riskScore = 0;
    if (findings.length > 0) {
      // Base score based on number of breaches
      riskScore = Math.min(100, findings.length * 15);

      // Add points for high-risk breaches
      const highRiskCount = findings.filter(
        (f) => f.riskLevel === '높음'
      ).length;
      riskScore = Math.min(100, riskScore + highRiskCount * 20);

      // Add points for sensitive data exposure
      const sensitiveDataCount = findings.filter(
        (f) =>
          f.exposedData.includes('비밀번호') ||
          f.exposedData.includes('신용카드정보') ||
          f.exposedData.includes('결제카드정보')
      ).length;
      riskScore = Math.min(100, riskScore + sensitiveDataCount * 15);
    }

    return NextResponse.json(
      {
        success: true,
        findings,
        riskScore,
        message:
          findings.length > 0
            ? `${findings.length}건의 유출이 발견되었습니다.`
            : '발견된 유출이 없습니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '스캔 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
