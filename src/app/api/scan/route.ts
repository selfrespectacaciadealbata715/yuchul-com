import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, name, username } = body;

    // Mock scan results - in production, integrate real HIBP API
    const findings = [];

    // Simulate breach detection
    if (email === 'example@gmail.com' || Math.random() > 0.7) {
      findings.push({
        id: '1',
        source: 'Collection #1',
        type: '다크웹' as const,
        dateFound: '2024-01-15',
        riskLevel: '높음' as const,
        exposedData: ['이메일', '비밀번호'],
        description: '알려진 대규모 데이터 유출에서 발견되었습니다.',
        status: 'new' as const,
      });
    }

    if (
      email?.includes('123rf') ||
      Math.random() > 0.8
    ) {
      findings.push({
        id: '2',
        source: '123RF 유출',
        type: '다크웹' as const,
        dateFound: '2024-02-10',
        riskLevel: '중간' as const,
        exposedData: ['이메일', '이름', '전화번호'],
        description: '123RF 웹사이트에서 유출된 정보',
        status: 'new' as const,
      });
    }

    return NextResponse.json(
      {
        success: true,
        findings,
        riskScore: findings.length * 35,
        message: `${findings.length}건의 유출이 발견되었습니다.`,
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
