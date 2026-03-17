// API Key management - stored in localStorage (client-side only)
// Keys never leave the user's browser except to call our own API routes

export type ProviderId = 'hibp' | 'leakcheck' | 'dehashed' | 'enzoic' | 'snusbase' | 'intelx';

export interface ProviderInfo {
  id: ProviderId;
  name: string;
  description: string;
  website: string;
  pricingInfo: string;
  features: string[];
  apiKeyPlaceholder: string;
  docsUrl: string;
}

export const PROVIDERS: ProviderInfo[] = [
  {
    id: 'hibp',
    name: 'Have I Been Pwned',
    description: '세계 최대 유출 데이터베이스. 이메일 기반 유출 조회 및 상세 유출 정보 제공.',
    website: 'https://haveibeenpwned.com',
    pricingInfo: '월 $3.50부터 (연간 결제 시 $3.25/월)',
    features: ['이메일 유출 조회', '유출 상세 정보', '도메인 검색', 'Stealer 로그'],
    apiKeyPlaceholder: 'hibp-api-key...',
    docsUrl: 'https://haveibeenpwned.com/API/Key',
  },
  {
    id: 'leakcheck',
    name: 'LeakCheck',
    description: '70억+ 레코드 보유. 이메일, 사용자명, 전화번호 등 다양한 검색 지원.',
    website: 'https://leakcheck.io',
    pricingInfo: '월 $9.99 / 평생 $69.99',
    features: ['이메일/사용자명 조회', '전화번호 검색', '비밀번호 해시 확인', '키워드 검색'],
    apiKeyPlaceholder: 'leakcheck-api-key...',
    docsUrl: 'https://wiki.leakcheck.io/en/api',
  },
  {
    id: 'dehashed',
    name: 'DeHashed',
    description: '133억+ 레코드. 다크웹/딥웹 포함 광범위한 유출 데이터 검색.',
    website: 'https://dehashed.com',
    pricingInfo: '100 크레딧 $3 (~$0.03/조회)',
    features: ['이메일/이름/주소 검색', '다크웹 데이터', 'IP 주소 조회', '해시 검색'],
    apiKeyPlaceholder: 'dehashed-api-key...',
    docsUrl: 'https://dehashed.com/api',
  },
  {
    id: 'enzoic',
    name: 'Enzoic',
    description: '엔터프라이즈급 유출 모니터링. 무료 티어 제공, 실시간 유출 알림.',
    website: 'https://www.enzoic.com',
    pricingInfo: '무료 티어 제공 (사용량 기반 과금)',
    features: ['비밀번호 유출 확인', '자격증명 모니터링', '도메인 모니터링', '실시간 알림'],
    apiKeyPlaceholder: 'enzoic-api-key...',
    docsUrl: 'https://docs.enzoic.com',
  },
  {
    id: 'snusbase',
    name: 'Snusbase',
    description: '검열 없는 유출 데이터 검색. 이메일, 사용자명, IP 등 다양한 검색.',
    website: 'https://snusbase.com',
    pricingInfo: '월 $5~$16',
    features: ['이메일/사용자명 검색', '비밀번호 해시 조회', 'IP 주소 검색', '일 2048 요청'],
    apiKeyPlaceholder: 'sb...',
    docsUrl: 'https://docs.snusbase.com',
  },
  {
    id: 'intelx',
    name: 'Intelligence X',
    description: '2000억+ 레코드. Tor/I2P/다크웹 포함 가장 방대한 데이터 아카이브.',
    website: 'https://intelx.io',
    pricingInfo: '연 €2,500부터 (엔터프라이즈)',
    features: ['다크웹/Tor 검색', '200B+ 레코드', '도메인/IP 분석', 'Paste 모니터링'],
    apiKeyPlaceholder: 'intelx-api-key...',
    docsUrl: 'https://intelx.io/account?tab=developer',
  },
];

const STORAGE_KEY = 'yuchul_api_keys';

export function getApiKey(providerId: ProviderId): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const keys = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return keys[providerId] || null;
  } catch {
    return null;
  }
}

export function setApiKey(providerId: ProviderId, key: string): void {
  if (typeof window === 'undefined') return;
  try {
    const keys = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (key.trim()) {
      keys[providerId] = key.trim();
    } else {
      delete keys[providerId];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // silently fail
  }
}

export function removeApiKey(providerId: ProviderId): void {
  setApiKey(providerId, '');
}

export function getAllApiKeys(): Partial<Record<ProviderId, string>> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getActiveProviders(): ProviderId[] {
  const keys = getAllApiKeys();
  return Object.keys(keys).filter((k) => keys[k as ProviderId]) as ProviderId[];
}
