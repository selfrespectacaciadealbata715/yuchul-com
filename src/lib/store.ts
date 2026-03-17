import { create } from 'zustand';
import type {
  ScanResult,
  User,
  Finding,
  RemovalRequest,
  Identifier,
  NotificationPreferences,
} from './types';

interface AppStore {
  user: User | null;
  scanResults: ScanResult | null;
  findings: Finding[];
  removalRequests: RemovalRequest[];
  isScanning: boolean;
  scanProgress: number;

  // User actions
  setUser: (user: User | null) => void;
  updateUser: (user: Partial<User>) => void;

  // Scan actions
  setScanResults: (results: ScanResult) => void;
  clearScanResults: () => void;
  setIsScanning: (isScanning: boolean) => void;
  setScanProgress: (progress: number) => void;

  // Findings actions
  setFindings: (findings: Finding[]) => void;
  addFinding: (finding: Finding) => void;
  updateFinding: (findingId: string, update: Partial<Finding>) => void;
  removeFinding: (findingId: string) => void;

  // Removal requests actions
  setRemovalRequests: (requests: RemovalRequest[]) => void;
  addRemovalRequest: (request: RemovalRequest) => void;
  updateRemovalRequest: (requestId: string, update: Partial<RemovalRequest>) => void;
  removeRemovalRequest: (requestId: string) => void;

  // Identifier management
  addIdentifier: (identifier: Identifier) => void;
  removeIdentifier: (identifierId: string) => void;

  // Notification preferences
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;

  // Reset
  reset: () => void;
}

const initialUser: User = {
  id: 'user_' + Math.random().toString(36).substr(2, 9),
  email: '',
  name: '',
  createdAt: new Date().toISOString(),
  identifiers: [],
  notificationPreferences: {
    emailNotifications: true,
    webNotifications: true,
    newBreachAlert: true,
    removalStatus: true,
    weeklyReport: true,
  },
};

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  scanResults: null,
  findings: [],
  removalRequests: [],
  isScanning: false,
  scanProgress: 0,

  setUser: (user) => set({ user }),
  updateUser: (update) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...update } : null,
    })),

  setScanResults: (results) => set({ scanResults: results }),
  clearScanResults: () => set({ scanResults: null }),
  setIsScanning: (isScanning) => set({ isScanning }),
  setScanProgress: (progress) => set({ scanProgress: progress }),

  setFindings: (findings) => set({ findings }),
  addFinding: (finding) =>
    set((state) => ({
      findings: [...state.findings, finding],
    })),
  updateFinding: (findingId, update) =>
    set((state) => ({
      findings: state.findings.map((f) =>
        f.id === findingId ? { ...f, ...update } : f
      ),
    })),
  removeFinding: (findingId) =>
    set((state) => ({
      findings: state.findings.filter((f) => f.id !== findingId),
    })),

  setRemovalRequests: (requests) => set({ removalRequests: requests }),
  addRemovalRequest: (request) =>
    set((state) => ({
      removalRequests: [...state.removalRequests, request],
    })),
  updateRemovalRequest: (requestId, update) =>
    set((state) => ({
      removalRequests: state.removalRequests.map((r) =>
        r.id === requestId ? { ...r, ...update } : r
      ),
    })),
  removeRemovalRequest: (requestId) =>
    set((state) => ({
      removalRequests: state.removalRequests.filter((r) => r.id !== requestId),
    })),

  addIdentifier: (identifier) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            identifiers: [...state.user.identifiers, identifier],
          }
        : null,
    })),
  removeIdentifier: (identifierId) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            identifiers: state.user.identifiers.filter(
              (i) => i.id !== identifierId
            ),
          }
        : null,
    })),

  updateNotificationPreferences: (prefs) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            notificationPreferences: {
              ...state.user.notificationPreferences,
              ...prefs,
            },
          }
        : null,
    })),

  reset: () =>
    set({
      user: null,
      scanResults: null,
      findings: [],
      removalRequests: [],
      isScanning: false,
      scanProgress: 0,
    }),
}));
