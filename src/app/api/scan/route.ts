import { NextRequest, NextResponse } from 'next/server';
import { checkBreaches } from '@/lib/hibp';
import { Finding, RiskLevel, BreachSource } from '@/lib/types';

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
          error: 'ì´ë©ì¼ì´ íìí©ëë¤.',
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
        ...breachData.map((breach, index) => ({
          id: `breach-${index}`,
          source: breach.name,
          type: 'ë¤í¬ì¹' as BreachSource, // Default to darkweb, could be enhanced with API data
          dateFound: breach.breachDate,
          riskLevel: breach.riskLevel || ('ì¤ê°' as RiskLevel),
          exposedData: breach.dataClasses,
          description: breach.description,
          url: breach.domain ? `https://${breach.domain}` : undefined,
          status: 'new' as const,
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
        (f) => f.riskLevel === 'ëì'
      ).length;
      riskScore = Math.min(100, riskScore + highRiskCount * 20);

      // Add points for sensitive data exposure
      const sensitiveDataCount = findings.filter(
        (f) =>
          f.exposedData.includes('ë¹ë°ë²í¸') ||
          f.exposedData.includes('ì ì©ì¹´ëì ë³´') ||
          f.exposedData.includes('ê²°ì ì¹´ëì ë³´')
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
            ? `${findings.length}ê±´ì ì ì¶ì´ ë°ê²¬ëììµëë¤.`
            : 'ë°ê²¬ë ì ì¶ì´ ììµëë¤.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'ì¤ìº ì¤ ì¤ë¥ê° ë°ìíìµëë¤.',
      },
      { status: 500 }
    );
  }
}
