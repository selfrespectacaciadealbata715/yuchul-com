import { NextResponse } from 'next/server';

// Server-side API route to call paid providers
// The user's API key is sent from the client (stored in localStorage)
// This route proxies the request to avoid CORS issues

export async function POST(request: Request) {
  try {
    const { provider, apiKey, email } = await request.json();

    if (!provider || !apiKey || !email) {
      return NextResponse.json(
        { error: 'provider, apiKey, email 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    switch (provider) {
      case 'hibp':
        return await queryHIBP(apiKey, email);
      case 'leakcheck':
        return await queryLeakCheck(apiKey, email);
      case 'dehashed':
        return await queryDeHashed(apiKey, email);
      case 'enzoic':
        return await queryEnzoic(apiKey, email);
      case 'snusbase':
        return await querySnusbase(apiKey, email);
      case 'intelx':
        return await queryIntelX(apiKey, email);
      default:
        return NextResponse.json(
          { error: `지원하지 않는 프로바이더: ${provider}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Provider API error:', error);
    return NextResponse.json(
      { error: 'API 요청 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// ===== Have I Been Pwned =====
async function queryHIBP(apiKey: string, email: string) {
  const response = await fetch(
    `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
    {
      headers: {
        'hibp-api-key': apiKey,
        'user-agent': 'yuchul.com-breach-checker',
      },
    }
  );

  if (response.status === 404) {
    return NextResponse.json({ provider: 'hibp', breaches: [], found: false });
  }

  if (response.status === 401) {
    return NextResponse.json({ error: 'HIBP API 키가 유효하지 않습니다.' }, { status: 401 });
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: `HIBP API 오류: ${response.status}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  const breaches = data.map((b: any) => ({
    source: 'hibp',
    name: b.Name,
    title: b.Title,
    domain: b.Domain,
    breachDate: b.BreachDate,
    addedDate: b.AddedDate,
    pwnCount: b.PwnCount,
    description: b.Description,
    dataClasses: b.DataClasses || [],
    isVerified: b.IsVerified,
    isSensitive: b.IsSensitive,
    logoPath: b.LogoPath ? `https://haveibeenpwned.com/Content/Images/PwnedLogos/${b.LogoPath}` : '',
  }));

  return NextResponse.json({ provider: 'hibp', breaches, found: breaches.length > 0 });
}

// ===== LeakCheck =====
async function queryLeakCheck(apiKey: string, email: string) {
  const response = await fetch(
    `https://leakcheck.io/api/public?check=${encodeURIComponent(email)}`,
    {
      headers: {
        'X-API-Key': apiKey,
      },
    }
  );

  if (response.status === 401) {
    return NextResponse.json({ error: 'LeakCheck API 키가 유효하지 않습니다.' }, { status: 401 });
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: `LeakCheck API 오류: ${response.status}` },
      { status: response.status }
    );
  }

  const data = await response.json();

  if (!data.success || !data.result || data.result.length === 0) {
    return NextResponse.json({ provider: 'leakcheck', breaches: [], found: false });
  }

  const breaches = data.result.map((r: any) => ({
    source: 'leakcheck',
    name: r.source?.name || '알 수 없음',
    title: r.source?.name || '유출 데이터',
    domain: '',
    breachDate: r.source?.date || '',
    pwnCount: 0,
    dataClasses: Object.keys(r).filter((k) => k !== 'source' && r[k]),
    isVerified: true,
  }));

  return NextResponse.json({ provider: 'leakcheck', breaches, found: breaches.length > 0 });
}

// ===== DeHashed =====
async function queryDeHashed(apiKey: string, email: string) {
  // DeHashed uses email:apikey as Basic auth
  const [dehashedEmail, dehashedKey] = apiKey.includes(':')
    ? apiKey.split(':')
    : ['', apiKey];

  const authHeader = Buffer.from(`${dehashedEmail}:${dehashedKey}`).toString('base64');

  const response = await fetch(
    `https://api.dehashed.com/search?query=email:${encodeURIComponent(email)}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${authHeader}`,
      },
    }
  );

  if (response.status === 401) {
    return NextResponse.json({ error: 'DeHashed API 키가 유효하지 않습니다. (이메일:키 형식 필요)' }, { status: 401 });
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: `DeHashed API 오류: ${response.status}` },
      { status: response.status }
    );
  }

  const data = await response.json();

  if (!data.entries || data.entries.length === 0) {
    return NextResponse.json({ provider: 'dehashed', breaches: [], found: false });
  }

  const breaches = data.entries.map((e: any) => ({
    source: 'dehashed',
    name: e.database_name || '알 수 없음',
    title: e.database_name || '유출 데이터',
    domain: e.email?.split('@')[1] || '',
    breachDate: e.obtained_date || '',
    pwnCount: 0,
    dataClasses: [
      e.email && '이메일',
      e.username && '사용자명',
      e.password && '비밀번호',
      e.hashed_password && '해시된 비밀번호',
      e.name && '이름',
      e.phone && '전화번호',
      e.address && '주소',
    ].filter(Boolean),
    isVerified: true,
  }));

  return NextResponse.json({ provider: 'dehashed', breaches, found: breaches.length > 0 });
}

// ===== Enzoic =====
async function queryEnzoic(apiKey: string, email: string) {
  // Enzoic uses apikey:secret as Basic auth
  const authHeader = Buffer.from(apiKey).toString('base64');

  const response = await fetch(
    `https://api.enzoic.com/v1/exposures?username=${encodeURIComponent(email)}`,
    {
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.status === 401) {
    return NextResponse.json({ error: 'Enzoic API 키가 유효하지 않습니다. (apikey:secret 형식 필요)' }, { status: 401 });
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: `Enzoic API 오류: ${response.status}` },
      { status: response.status }
    );
  }

  const data = await response.json();

  if (!data.exposures || data.exposures.length === 0) {
    return NextResponse.json({ provider: 'enzoic', breaches: [], found: false });
  }

  const breaches = data.exposures.map((e: any) => ({
    source: 'enzoic',
    name: e.title || '유출 사건',
    title: e.title || '유출 데이터',
    domain: '',
    breachDate: e.date || '',
    pwnCount: e.entries || 0,
    dataClasses: e.dataClasses || [],
    isVerified: true,
  }));

  return NextResponse.json({ provider: 'enzoic', breaches, found: breaches.length > 0 });
}

// ===== Snusbase =====
async function querySnusbase(apiKey: string, email: string) {
  const response = await fetch('https://api.snusbase.com/data/search', {
    method: 'POST',
    headers: {
      Auth: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      terms: [email],
      types: ['email'],
    }),
  });

  if (response.status === 401) {
    return NextResponse.json({ error: 'Snusbase API 키가 유효하지 않습니다.' }, { status: 401 });
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: `Snusbase API 오류: ${response.status}` },
      { status: response.status }
    );
  }

  const data = await response.json();

  if (!data.results || Object.keys(data.results).length === 0) {
    return NextResponse.json({ provider: 'snusbase', breaches: [], found: false });
  }

  const breaches = Object.entries(data.results).map(([dbName, entries]: [string, any]) => ({
    source: 'snusbase',
    name: dbName,
    title: dbName,
    domain: '',
    breachDate: '',
    pwnCount: Array.isArray(entries) ? entries.length : 0,
    dataClasses: ['이메일', '비밀번호'],
    isVerified: true,
  }));

  return NextResponse.json({ provider: 'snusbase', breaches, found: breaches.length > 0 });
}

// ===== Intelligence X =====
async function queryIntelX(apiKey: string, email: string) {
  // Step 1: Start search
  const searchResponse = await fetch(
    `https://2.intelx.io/intelligent/search`,
    {
      method: 'POST',
      headers: {
        'x-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        term: email,
        maxresults: 20,
        media: 0,
        terminate: [2],
      }),
    }
  );

  if (searchResponse.status === 401 || searchResponse.status === 402) {
    return NextResponse.json({ error: 'IntelX API 키가 유효하지 않습니다.' }, { status: 401 });
  }

  if (!searchResponse.ok) {
    return NextResponse.json(
      { error: `IntelX API 오류: ${searchResponse.status}` },
      { status: searchResponse.status }
    );
  }

  const searchData = await searchResponse.json();
  const searchId = searchData.id;

  if (!searchId) {
    return NextResponse.json({ provider: 'intelx', breaches: [], found: false });
  }

  // Step 2: Get results (with small delay)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const resultResponse = await fetch(
    `https://2.intelx.io/intelligent/search/result?id=${searchId}&limit=20`,
    {
      headers: { 'x-key': apiKey },
    }
  );

  if (!resultResponse.ok) {
    return NextResponse.json({ provider: 'intelx', breaches: [], found: false });
  }

  const resultData = await resultResponse.json();

  if (!resultData.records || resultData.records.length === 0) {
    return NextResponse.json({ provider: 'intelx', breaches: [], found: false });
  }

  const breaches = resultData.records.map((r: any) => ({
    source: 'intelx',
    name: r.name || '유출 데이터',
    title: r.name || '다크웹 데이터',
    domain: '',
    breachDate: r.date || '',
    pwnCount: 0,
    dataClasses: ['다크웹 데이터'],
    isVerified: false,
  }));

  return NextResponse.json({ provider: 'intelx', breaches, found: breaches.length > 0 });
}
