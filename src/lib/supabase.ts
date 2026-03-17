import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase credentials are not configured. Some features may not work.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Google OAuth login
export const signInWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};

// Email/password auth
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

// Scan limit helpers (2x per week)
const SCAN_LIMIT_KEY = 'yuchul_scan_history';
const MAX_SCANS_PER_WEEK = 2;

export const getScanHistory = (): string[] => {
  if (typeof window === 'undefined') return [];
  const history = localStorage.getItem(SCAN_LIMIT_KEY);
  return history ? JSON.parse(history) : [];
};

export const canScan = (): { allowed: boolean; remaining: number; nextReset: Date } => {
  const history = getScanHistory();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentScans = history.filter(
    (date) => new Date(date) > oneWeekAgo
  );

  const remaining = MAX_SCANS_PER_WEEK - recentScans.length;
  const nextReset = recentScans.length > 0
    ? new Date(new Date(recentScans[0]).getTime() + 7 * 24 * 60 * 60 * 1000)
    : new Date();

  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    nextReset,
  };
};

export const recordScan = () => {
  const history = getScanHistory();
  history.push(new Date().toISOString());
  localStorage.setItem(SCAN_LIMIT_KEY, JSON.stringify(history));
};
