import { create } from 'zustand';
import type {
  ScanResult,
  User,
  Finding,
  RemovalRequest,
  Identifier,
  NotificationPreferences,
  ScanInput,
} from './types';

interface AppStore {
  user: User | null;
  scanResults: ScanResult | null;
  findings: Finding[];
  removalRequests: RemovalRequest[];
  isScanning: boolean;
  scanProgress: number;
  pendingScanInput: ScanInput | null;

  setUser: (user: User | null) => void;
  updateUser: (user: Partial<User>) => void;
  setScanResults: (results: ScanResult | null) => void;
  clearScanResults: () => void;
  setIsScanning: (isScanning: boolean) => void;
  setScanProgress: (progress: number) => void;
  setPendingScanInput: (input: ScanInput | null) => void;
  setFindings: (findings: Finding[]) => void;
  addFinding: (finding: Finding) => void;
  updateFinding: (findingId: string, update: Partial<Finding>) => void;
  removeFinding: (findingId: string) => void;
  setRemovalRequests: (requests: RemovalRequest[]) => void;
  addRemovalRequest: (request: RemovalRequest) => void;
  updateRemovalRequest: (requestId: string, update: Partial<RemovalRequest>) => void;
  removeRemovalRequest: (requestId: string) => void;
  addIdentifier: (identifier: Identifier) => void;
  removeIdentifier: (identifierId: string) => void;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  reset: () => void;
}

function saveTo(key: string, value: any) {
  if (typeof window === 'undefined') return;
  if (value === null || (Array.isArray(value) && value.length === 0)) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function loadFrom<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  scanResults: null,
  findings: [],
  removalRequests: [],
  isScanning: false,
  scanProgress: 0,
  pendingScanInput: null,

  setUser: (user) => set({ user }),
  updateUser: (update) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...update } : null,
    })),

  setScanResults: (results) => {
    saveTo('yuchul_scan_results', results);
    return set({ scanResults: results });
  },
  clearScanResults: () => {
    saveTo('yuchul_scan_results', null);
    return set({ scanResults: null });
  },
  setIsScanning: (isScanning) => set({ isScanning }),
  setScanProgress: (progress) => set({ scanProgress: progress }),
  setPendingScanInput: (input) => {
    saveTo('yuchul_pending_scan', input);
    return set({ pendingScanInput: input });
  },

  setFindings: (findings) => {
    saveTo('yuchul_findings', findings);
    return set({ findings });
  },
  addFinding: (finding) =>
    set((state) => {
      const next = [...state.findings, finding];
      saveTo('yuchul_findings', next);
      return { findings: next };
    }),
  updateFinding: (findingId, update) =>
    set((state) => {
      const next = state.findings.map((f) =>
        f.id === findingId ? { ...f, ...update } : f
      );
      saveTo('yuchul_findings', next);
      return { findings: next };
    }),
  removeFinding: (findingId) =>
    set((state) => {
      const next = state.findings.filter((f) => f.id !== findingId);
      saveTo('yuchul_findings', next);
      return { findings: next };
    }),

  setRemovalRequests: (requests) => {
    saveTo('yuchul_removal_requests', requests);
    return set({ removalRequests: requests });
  },
  addRemovalRequest: (request) =>
    set((state) => {
      const next = [...state.removalRequests, request];
      saveTo('yuchul_removal_requests', next);
      return { removalRequests: next };
    }),
  updateRemovalRequest: (requestId, update) =>
    set((state) => {
      const next = state.removalRequests.map((r) =>
        r.id === requestId ? { ...r, ...update } : r
      );
      saveTo('yuchul_removal_requests', next);
      return { removalRequests: next };
    }),
  removeRemovalRequest: (requestId) =>
    set((state) => {
      const next = state.removalRequests.filter((r) => r.id !== requestId);
      saveTo('yuchul_removal_requests', next);
      return { removalRequests: next };
    }),

  addIdentifier: (identifier) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, identifiers: [...state.user.identifiers, identifier] }
        : null,
    })),
  removeIdentifier: (identifierId) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, identifiers: state.user.identifiers.filter((i) => i.id !== identifierId) }
        : null,
    })),

  updateNotificationPreferences: (prefs) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, notificationPreferences: { ...state.user.notificationPreferences, ...prefs } }
        : null,
    })),

  reset: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('yuchul_pending_scan');
      localStorage.removeItem('yuchul_scan_results');
      localStorage.removeItem('yuchul_findings');
      localStorage.removeItem('yuchul_removal_requests');
    }
    return set({
      user: null, scanResults: null, findings: [], removalRequests: [],
      isScanning: false, scanProgress: 0, pendingScanInput: null,
    });
  },
}));

export function hydrateStore() {
  const pending = loadFrom<ScanInput | null>('yuchul_pending_scan', null);
  const results = loadFrom<ScanResult | null>('yuchul_scan_results', null);
  const findings = loadFrom<Finding[]>('yuchul_findings', []);
  const removals = loadFrom<RemovalRequest[]>('yuchul_removal_requests', []);

  useAppStore.setState({
    ...(pending ? { pendingScanInput: pending } : {}),
    ...(results ? { scanResults: results } : {}),
    ...(findings.length > 0 ? { findings } : {}),
    ...(removals.length > 0 ? { removalRequests: removals } : {}),
  });
}
