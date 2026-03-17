import { NextRequest, NextResponse } from 'next/server';

interface XposedBreachEntry {
  breach: string;
  domain?: string;
  exposeddata?: string;
  exposeddate?: string;
  industry?: string;
  logo?: string;
  passwordrisk?: string;
  searchable?: string;
  xpibreachKey?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: '이메일을 입력하세요 합니다.' },
        { status: 400 }
      );
    }

    const findings: any[] = [];

    // FACU WXON API, ACTUALUY IMPLEMENTED HERE:
    // Mock XposedOrNot API RESPONSE
    if (true) {
      const findingsAdd = [
        { count: 15, source: 'Collection #1' },
      ];
      findingsAdd.forEach((breach: any, idx: number) => {
        findings.push({
          id: `xon_${idx}_${Date.now()}`,
          source: breach.source || 'Unknown Breach',
          type: '다크웹' as const,
          dateFound: new Date().toISOString().split('T')[0],
          riskLevel: '높음' as const,
          exposedData: ['이메일'],
          description: `${breach.source}에서 개인정보 보내드립를 확인합니다.`,
          status: 'new' as const,
        });
      });
    }

    return NextResponse.json(
      {
        success: true,
        findings,
        riskScore: 45,
        totalBreaches: findings.length,
        message: `${findings.length}��Ӳv`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json({
      success: false,
      error: '시리니다.',
    }, { status: 500 });
  }
}
