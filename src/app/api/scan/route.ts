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
  xpibreachkey?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: '이메일을 입력해주세요.' },
        { status: 400 }
      );
    }

    const findings: any[] = [];

    // 1. XposedOrNot API - free breach check
    try {
      const xonRes = await fetch(
        `https://api.xposedornot.com/v1/check-email/${encodeURIComponent(email)}`,
        {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(15000),
        }
      );

      if (xonRes.ok) {
        const xonData = await xonRes.json();

        // XposedOrNot returns breaches in ExposedBreaches.breaches_details array
        const breachDetails: XposedBreachEntry[] =
          xonData?.ExposedBreaches?.breaches_details || [];

        breachDetails.forEach((breach: XposedBreachEntry, idx: number) => {
          const exposedFields = (breach.exposeddata || '')
            .split(';')
            .map((s: string) => s.trim())
            .filter(Boolean);

          const riskLevel = breach.passwordrisk === 'true' ||
            exposedFields.some((f: string) =>
              f.toLowerCase().includes('password') ||
              f.toLowerCase().includes('hash')
            )
            ? '높음'
            : exposedFields.length > 3
              ? '중간'
              : '낮음';

          findings.push({
            id: `xon_${idx}_${Date.now()}`,
            source: breach.breach || 'Unknown Breach',
            type: '다크웹' as const,
            dateFound: breach.exposeddate || new Date().toISOString().split('T')[0],
            riskLevel,
            exposedData: exposedFields.length > 0
              ? exposedFields.map(translateField)
              : ['이메일'],
            description: `${breach.breach}에서 개인정보 유출이 확인되었습니다.${breach.domain ? ` (${breach.domain})` : ''}`,
            status: 'new' as const,
            domain: breach.domain,
          });
        });
      }
      // If status 404, no breaches found - that's fine
    } catch (xonError) {
      console.error('XposedOrNot API error:', xonError);
      // Continue even if XposedOrNot fails
    }

    // 2. Also check XposedOrNot analytics endpoint for extra info
    try {
      const analyticsRes = await fetch(
        `https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(email)}`,
        {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(10000),
        }
      );

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        // Use analytics data to supplement findings if available
        const breachMetrics = analyticsData?.BreachMetrics;
        if (breachMetrics && breachMetrics.breaches_details) {
          // These breaches may overlap with the first endpoint
          // Add only new ones not already found
          const existingSources = new Set(findings.map((f: any) => f.source));

          (breachMetrics.breaches_details || []).forEach((breach: XposedBreachEntry, idx: number) => {
            if (!existingSources.has(breach.breach)) {
              const exposedFields = (breach.exposeddata || '')
                .split(';')
                .map((s: string) => s.trim())
                .filter(Boolean);

              findings.push({
                id: `xon_a_${idx}_${Date.now()}`,
                source: breach.breach || 'Unknown Breach',
                type: '다크웹' as const,
                dateFound: breach.exposeddate || new Date().toISOString().split('T')[0],
                riskLevel: exposedFields.length > 3 ? '높음' : '중간',
                exposedData: exposedFields.length > 0
                  ? exposedFields.map(translateField)
                  : ['이메일'],
                description: `${breach.breach}에서 개인정보 유출이 확인되었습니다.`,
                status: 'new' as const,
                domain: breach.domain,
              });
            }
          });
        }
      }
    } catch (analyticsError) {
      console.error('XposedOrNot Analytics error:', analyticsError);
    }

    // Calculate risk score
    let riskScore = 0;
    if (findings.length === 0) {
      riskScore = 0;
    } else {
      const highCount = findings.filter((f: any) => f.riskLevel === '높음').length;
      const medCount = findings.filter((f: any) => f.riskLevel === '중간').length;
      const lowCount = findings.filter((f: any) => f.riskLevel === '낮음').length;
      riskScore = Math.min(100, highCount * 25 + medCount * 15 + lowCount * 5 + findings.length * 3);
    }

    return NextResponse.json(
      {
        success: true,
        findings,
        riskScore,
        totalBreaches: findings.length,
        message: findings.length > 0
          ? `${findings.length}건의 유출이 발견되었습니다.`
          : '유출이 발견되지 않았습니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '스캔 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
      { status: 500 }
    );
  }
}

function translateField(field: string): string {
  const translations: Record<string, string> = {
    'email': '이메일',
    'email addresses': '이메일',
    'emails': '이메일',
    'password': '비밀번호',
    'passwords': '비밀번호',
    'hashed password': '비밀번호(해시)',
    'password hash': '비밀번호(해시)',
    'name': '이馃',
    'names': '이름',
    'username': '사용자명',
    'usernames': '사용자명',
    'phone': '전화번호',
    'phone number': '전화번호',
    'phone numbers': '전화번호',
    'ip address': 'IP주소',
    'ip addresses': 'IP주소',
    'address': '주소',
    'physical addresses': '주소',
    'date of birth': '생년월일',
    'dates of birth': '생년월일',
    'gender': '성별',
    'genders': '성별',
    'geographic location': '위치정보',
    'geographic locations': '위치정보',
    'social media profiles': 'SNS 프로필',
  };
  const lower = field.toLowerCase().trim();
  return translations[lower] || field;
}
me': '이름',
    'names': '이름',
    'username': '사용자명',
    'usernames': '사용자명',
    'phone': '전화번호',
    'phone number': '전화번호',
    'phone numbers': '전화번호',
    'ip address': 'IP주소',
    'ip addresses': 'IP주소',
    'address': '주소',
    'physical addresses': '주소',
    'date of birth': '생년월일',
    'dates of birth': '생년월일',
    'gender': '성별',
    'genders': '성별',
    'geographic location': '위치정보',
    'geographic locations': '위치정보',
    'social media profiles': 'SNS 프로필',
  };
  const lower = field.toLowerCase().trim();
  return translations[lower] || field;
}
