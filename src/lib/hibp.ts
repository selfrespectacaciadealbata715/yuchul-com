// Have I Been Pwned API wrapper using k-anonymity (free endpoint)
// This endpoint doesn't require API key and is free to use

const HIBP_API_URL = 'https://api.pwnedpasswords.com/range';

interface BreachData {
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
}

// Mock breach data for demonstration
const MOCK_BREACHES = {
  'example@gmail.com': [
    {
      name: 'Collection #1',
      domain: 'unknown',
      date: '2019-01-01',
      exposedData: ['이메일', '비밀번호'],
      breachCount: 773154,
    },
    {
      name: '123RF Data Breach',
      domain: 'shutterstock.com',
      date: '2020-06-15',
      exposedData: ['이메일', '이름', '전화번호'],
      breachCount: 8945234,
    },
  ],
  'user@example.com': [
    {
      name: 'LinkedIn Scrape',
      domain: 'linkedin.com',
      date: '2021-04-22',
      exposedData: ['이메일', '이름', '직급'],
      breachCount: 700000000,
    },
  ],
};

export async function checkBreaches(
  identifier: string
): Promise<BreachData[] | null> {
  try {
    // Mock API call - in production, integrate real HIBP API
    const mockData = MOCK_BREACHES[identifier as keyof typeof MOCK_BREACHES];

    if (mockData) {
      return mockData.map((breach) => ({
        name: breach.name,
        title: breach.name,
        domain: breach.domain,
        breachDate: breach.date,
        addedDate: breach.date,
        modifiedDate: breach.date,
        pwnCount: breach.breachCount,
        description: `${breach.exposedData.join(', ')}가 노출되었습니다.`,
        dataClasses: breach.exposedData,
        isVerified: true,
        isFabricated: false,
        isSensitive: false,
        isRetired: false,
        isSpamList: false,
        logoPath: '/breach-logos/default.png',
      })) as BreachData[];
    }

    return null;
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
