// XposedOrNot API wrapper with k-anonymity for password checking
// XposedOrNot API is free with no API key needed
// HIBP k-anonymity API for password checking

const XPOSED_OR_NOT_BASE_URL = 'https://api.xposedornot.com/v1';
const HIBP_API_URL = 'https://api.pwnedpasswords.com/range';

// Korean translations for exposed data types
const DATA_TYPE_TRANSLATIONS: Record<string, string> = {
  'Emails': '이메일',
  'Passwords': '비밀번호',
  'Names': '이름',
  'Usernames': '사용자명',
  'Phone Numbers': '전화번호',
  'Physical Addresses': '주소',
  'Dates of Birth': '생년월일',
  'Payment Card Data': '결제카드정보',
  'IP Addresses': 'IP주소',
  'Credit Card Data': '신용카드정보',
  'Social Media Profiles': '소셜미디어계정',
  'Job Titles': '직급',
  'Postal Codes': '우편번호',
  'Gender': '성별',
  'Government IDs': '정부ID',
  'Security Questions': '보안질문',
  'Historical Passwords': '과거비밀번호',
};

// Risk level mapping
const RISK_LABEL_MAP: Record<string, '높음' | '중간' | '낮음'> = {
  'Critical': '높음',
  'High': '높음',
  'Medium': '중간',
  'Low': '낮음',
};

interface XposedOrNotCheckResponse {
  breaches: string[][];
}

interface BreachDetail {
  breach: string;
  details: string;
  domain: string;
  industry: string;
  logo: string;
  password_risk: string;
  searchable: string;
  xposed_data: string;
  xposed_date: string;
  xposed_records: number;
}

interface BreachesSummary {
  site: string;
  risk_label: string;
}

interface XposedOrNotAnalyticsResponse {
  ExposedBreaches: {
    breaches_details: BreachDetail[];
  };
  BreachesSummary: BreachesSummary;
  PastesSummary: Record<string, unknown>;
}

export interface BreachData {
  name: string;
  title: string;
  domain: string;
  breachDate: string;
  addedDate: string;
  modifiedDate: string;
  pwnCount: number;
  description: string;
  dataClasses: string[];
  isVerified: boolean;
  isFabricated: boolean;
  isSensitive: boolean;
  isRetired: boolean;
  isSpamList: boolean;
  logoPath: string;
  riskLevel?: '높음' | '중간' | '낮음';
}

function translateExposedData(xposedDataString: string): string[] {
  return xposedDataString.split(';').map((item) => {
    const trimmed = item.trim();
    return DATA_TYPE_TRANSLATIONS[trimmed] || trimmed;
  });
}

export async function checkBreaches(email: string): Promise<BreachData[] | null> {
  try {
    // Call breach-analytics endpoint for detailed information
    const response = await fetch(
      `${XPOSED_OR_NOT_BASE_URL}/breach-analytics/${encodeURIComponent(email)}`
    );

    // Return null if no breaches found (404)
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.error(`Error from XposedOrNot API: ${response.status}`);
      return null;
    }

    const data: XposedOrNotAnalyticsResponse = await response.json();

    // Check if there are any breaches
    if (
      !data.ExposedBreaches ||
      !data.ExposedBreaches.breaches_details ||
      data.ExposedBreaches.breaches_details.length === 0
    ) {
      return null;
    }

    // Get risk level from summary
    const riskLabel = data.BreachesSummary?.risk_label || 'Low';
    const riskLevel = RISK_LABEL_MAP[riskLabel] || '낮음';

    // Map API response to BreachData format
    const breaches: BreachData[] = data.ExposedBreaches.breaches_details.map(
      (detail: BreachDetail) => ({
        name: detail.breach,
        title: detail.breach,
        domain: detail.domain,
        breachDate: detail.xposed_date,
        addedDate: detail.xposed_date,
        modifiedDate: detail.xposed_date,
        pwnCount: detail.xposed_records,
        description: detail.details,
        dataClasses: translateExposedData(detail.xposed_data),
        isVerified: true,
        isFabricated: false,
        isSensitive: detail.password_risk === 'plaintext',
        isRetired: false,
        isSpamList: false,
        logoPath: detail.logo || '/breach-logos/default.png',
        riskLevel,
      })
    );

    return breaches;
  } catch (error) {
    console.error('Error checking breaches:', error);
    return null;
  }
}

export async function checkPassword(password: string): Promise<number> {
  try {
    // K-anonymity API endpoint - first 5 chars of SHA-1 hash
    const sha1 = await hashPassword(password);
    const prefix = sha1.substring(0, 5);
    const suffix = sha1.substring(5).toUpperCase();

    const response = await fetch(`${HIBP_API_URL}/${prefix}`);

    if (!response.ok) {
      return 0;
    }

    const text = await response.text();
    const hashes = text.split('\r\n');

    for (const hash of hashes) {
      const [hashSuffix, count] = hash.split(':');
      if (hashSuffix === suffix) {
        return parseInt(count, 10);
      }
    }

    return 0;
  } catch (error) {
    console.error('Error checking password:', error);
    return 0;
  }
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex.toUpperCase();
}
