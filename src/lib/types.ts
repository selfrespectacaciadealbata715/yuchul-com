export interface ScanInput {
  name: string;
  email: string;
  phone: string;
  username: string;
}

export type RiskLevel = '높음' | '중간' | '낮음';

export type BreachSource = '다크웹' | '서피스웹' | '데이터브로커';

export interface Finding {
  id: string;
  source: string;
  type: BreachSource;
  dateFound: string;
  riskLevel: RiskLevel;
  exposedData: string[];
  description: string;
  url?: string;
  status: 'new' | 'in-progress' | 'removed' | 'ignored';
}

export interface RemovalRequest {
  id: string;
  findingId: string;
  status: '대기중' | '진행중' | '완료' | '실패';
  createdAt: string;
  completedAt?: string;
  progress: number;
  dataController?: string;
  requestType: 'automatic' | 'manual';
}

export interface DashboardData {
  riskScore: number;
  totalBreaches: number;
  removalableBreach: number;
  removalQueueCount: number;
  findings: Finding[];
  removalRequests: RemovalRequest[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  identifiers: Identifier[];
  notificationPreferences: NotificationPreferences;
}

export interface Identifier {
  id: string;
  type: 'email' | 'phone' | 'username' | 'name';
  value: string;
  addedAt: string;
  scanCount: number;
  lastScanned?: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  webNotifications: boolean;
  newBreachAlert: boolean;
  removalStatus: boolean;
  weeklyReport: boolean;
}

export interface ScanResult {
  input: ScanInput;
  findings: Finding[];
  timestamp: string;
  riskScore: number;
}
