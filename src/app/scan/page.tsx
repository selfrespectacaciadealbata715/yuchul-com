'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { supabase, signInWithGoogle, canScan, recordScan } from '@/lib/supabase';
import ScanForm from '@/components/ScanForm';
import FindingCard from '@/components/FindingCard';
import { ArrowLeft, Lock, AlertTriangle, Key, Shield } from 'lucide-react';
import Link from 'next/link';
import type { ScanInput, Finding } from '@/lib/types';
import type { User } from '@supabase/supabase-js';
import { getActiveProviders, getAllApiKeys, PROVIDERS } from '@/lib/api-keys';
import type { ProviderId } from '@/lib/api-keys';

export default function ScanPage() {
  const router = useRouter();
  const {
    isScanning,
    scanProgress,
    scanResults,
    setIsScanning,
    setScanProgress,
    setScanResults,
    setFindings,
    addRemovalRequest,
  } = useAppStore();

  const [user, setUser] = useState<User | null>(null);
  const [scanLimit, setScanLimit] = useState({ allowed: true, remaining: 2, nextReset: new Date() });
  const [scanError, setScanError] = useState<string | null>(null);
  const [activeProviderCount, setActiveProviderCount] = useState(0);
  const [providerStatuses, setProviderStatuses] = useState<Record<string, 'pending' | 'scanning' | 'done' | 'error'>>({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    // Check scan limit
    setScanLimit(canScan());

    // Check active providers
    setActiveProviderCount(getActiveProviders().length);

    return () => subscription.unsubscribe();
  }, []);

  const handleScan = async (data: ScanInput) => {
    // Check login
    if (!user) return;

    // Check scan limit
    const status = canScan();
    if (!status.allowed) {
      setScanLimit(status);
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanError(null);
    setProviderStatuses({});

    const activeProviders = getActiveProviders();
    const apiKeys = getAllApiKeys();

    // Track total sources (free + paid)
    const totalSources = 1 + activeProviders.length;
    let completedSources = 0;

    // Initialize provider statuses
    const initialStatuses: Record<string, string> = { free: 'scanning' };
    activeProviders.forEach((p) => {
      initialStatuses[p] = 'pending';
    });
    setProviderStatuses(initialStatuses as any);

    const allFindings: Finding[] = [];

    // Helper to update progress
    const updateProgress = () => {
      completedSources++;
      setScanProgress(Math.min(95, (completedSources / totalSources) * 90));
    };

    try {
      // 1. Free scan (XposedOrNot)
      const freePromise = fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Free scan failed');
          const apiData = await res.json();
          setProviderStatuses((prev) => ({ ...prev, free: 'done' }));
          updateProgress();
          if (apiData.success && apiData.findings) {
            allFindings.push(...apiData.findings);
          }
          return apiData;
        })
        .catch((err) => {
          setProviderStatuses((prev) => ({ ...prev, free: 'error' }));
          updateProgress();
          console.error('Free scan error:', err);
          return null;
        });

      // 2. Paid provider scans (in parallel)
      const paidPromises = activeProviders.map((providerId) => {
        setProviderStatuses((prev) => ({ ...prev, [providerId]: 'scanning' }));

        return fetch('/api/providers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: providerId,
            apiKey: apiKeys[providerId],
            email: data.email,
          }),
        })
          .then(async (res) => {
            const result = await res.json();
            if (res.ok && result.breaches && result.breaches.length > 0) {
              const providerFindings: Finding[] = result.breaches.map(
                (breach: any, index: number): Finding => ({
                  id: `${providerId}-${index}`,
                  source: `${breach.name} (${providerId.toUpperCase()})`,
                  type: providerId === 'intelx' || providerId === 'snusbase' ? '다크웹' : '서피스웹',
                  dateFound: breach.breachDate || new Date().toISOString(),
                  riskLevel: breach.dataClasses?.some((d: string) =>
                    ['비밀번호', '신용카드정보', '결제카드정보', 'password', 'Passwords'].includes(d)
                  )
                    ? '높음'
                    : '중간',
                  exposedData: breach.dataClasses || [],
                  description: breach.description || `${breach.name}에서 유출된 데이터`,
                  url: breach.domain ? `https://${breach.domain}` : undefined,
                  status: 'new',
                })
              );
              allFindings.push(...providerFindings);
            }
            setProviderStatuses((prev) => ({ ...prev, [providerId]: 'done' }));
            updateProgress();
            return result;
          })
          .catch((err) => {
            setProviderStatuses((prev) => ({ ...prev, [providerId]: 'error' }));
            updateProgress();
            console.error(`Provider ${providerId} error:`, err);
            return null;
          });
      });

      // Wait for all scans to complete
      await Promise.all([freePromise, ...paidPromises]);

      // Complete progress
      setScanProgress(100);

      // Record scan usage
      recordScan();
      setScanLimit(canScan());

      // Deduplicate findings by source name
      const uniqueFindings = deduplicateFindings(allFindings);

      // Calculate risk score
      let riskScore = 0;
      if (uniqueFindings.length > 0) {
        riskScore = Math.min(100, uniqueFindings.length * 15);
        const highRiskCount = uniqueFindings.filter((f) => f.riskLevel === '높음').length;
        riskScore = Math.min(100, riskScore + highRiskCount * 20);
        const sensitiveDataCount = uniqueFindings.filter(
          (f) =>
            f.exposedData.includes('비밀번호') ||
            f.exposedData.includes('신용카드정보') ||
            f.exposedData.includes('결제카드정보')
        ).length;
        riskScore = Math.min(100, riskScore + sensitiveDataCount * 15);
      }

      setScanResults({
        input: data,
        findings: uniqueFindings,
        timestamp: new Date().toISOString(),
        riskScore,
      });

      setFindings(uniqueFindings);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setScanError(errorMessage);
      console.error('Scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const deduplicateFindings = (findings: Finding[]): Finding[] => {
    const seen = new Map<string, Finding>();
    for (const finding of findings) {
      const normalizedSource = finding.source.toLowerCase().replace(/\s*\([^)]*\)\s*$/, '').trim();
      const key = `${normalizedSource}-${finding.dateFound || ''}`;
      if (!seen.has(key)) {
        seen.set(key, finding);
      }
    }
    return Array.from(seen.values());
  };

  const handleRemove = (findingId: string) => {
    addRemovalRequest({
      id: 'req_' + Math.random().toString(36).substr(2, 9),
      findingId,
      status: '대기중',
      createdAt: new Date().toISOString(),
      progress: 0,
      requestType: 'automatic',
    });
  };

  const getProviderName = (id: string) => {
    if (id === 'free') return 'XposedOrNot (무료)';
    const provider = PROVIDERS.find((p) => p.id === id);
    return provider?.name || id;
  };

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-primary transition-smooth mb-6"
          >
            <ArrowLeft size={20} />
            <span>돌아가기</span>
          </Link>
          <h1 className="text-4xl font-bold mb-2">개인정보 유출 확인</h1>
          <p className="text-gray-400">
            당신의 개인정보가 유출되었는지 지금 바로 확인해보세요.
          </p>
        </div>

        {/* Login Required */}
        {!user ? (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center mb-12">
            <Lock size={48} className="mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-3">Google 로그인 필요</h2>
            <p className="text-gray-400 mb-6">
              스팸 방지를 위해 Google 로그인 후 스캔할 수 있습니다.
            </p>
            <button
              onClick={() => signInWithGoogle()}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-smooth font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google로 로그인</span>
            </button>
            <p className="text-xs text-gray-500 mt-4">
              주 2회 무료 스캔 • 개인정보는 저장하지 않습니다
            </p>
          </div>
        ) : (
          <>
            {/* Scan Limit Warning */}
            {!scanLimit.allowed && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5 mb-6 flex items-start space-x-3">
                <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-yellow-300 font-medium">주간 스캔 한도 도달</p>
                  <p className="text-sm text-gray-400 mt-1">
                    이번 주 스캔 2회를 모두 사용했습니다.{' '}
                    {scanLimit.nextReset.toLocaleDateString('ko-KR')}에 초기화됩니다.
                  </p>
                </div>
              </div>
            )}

            {/* Scan Remaining + Active Providers */}
            {scanLimit.allowed && !isScanning && !scanResults && (
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  이번 주 남은 스캔: <strong className="text-primary">{scanLimit.remaining}회</strong> / 2회
                </div>
                {activeProviderCount > 0 ? (
                  <div className="flex items-center space-x-2 text-sm text-green-400">
                    <Shield size={16} />
                    <span>{activeProviderCount}개 유료 프로바이더 활성</span>
                  </div>
                ) : (
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center space-x-2 text-sm text-gray-400 hover:text-primary transition-smooth"
                  >
                    <Key size={16} />
                    <span>유료 API 추가로 더 정확한 스캔</span>
                  </Link>
                )}
              </div>
            )}

            {/* Scan Form */}
            {!isScanning && !scanResults && (
              <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism mb-12">
                <h2 className="text-2xl font-semibold mb-6">정보 입력</h2>
                <ScanForm
                  onSubmit={handleScan}
                  isLoading={isScanning}
                />
              </div>
            )}
          </>
        )}

        {/* Scanning Progress */}
        {isScanning && (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism mb-12">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-6">스캔 진행 중...</h2>
              <div className="w-full bg-dark-border rounded-full h-2 overflow-hidden mb-4">
                <div
                  className="bg-gradient-primary h-full transition-all duration-300"
                  style={{ width: `${Math.min(scanProgress, 100)}%` }}
                />
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {Math.floor(Math.min(scanProgress, 100))}% 완료
              </p>

              {/* Provider Status */}
              {Object.keys(providerStatuses).length > 0 && (
                <div className="mt-4 space-y-2 text-left max-w-md mx-auto">
                  {Object.entries(providerStatuses).map(([id, pStatus]) => (
                    <div key={id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{getProviderName(id)}</span>
                      <span
                        className={`${
                          pStatus === 'scanning'
                            ? 'text-yellow-400'
                            : pStatus === 'done'
                              ? 'text-green-400'
                              : pStatus === 'error'
                                ? 'text-red-400'
                                : 'text-gray-500'
                        }`}
                      >
                        {pStatus === 'scanning'
                          ? '스캔 중...'
                          : pStatus === 'done'
                            ? '완료'
                            : pStatus === 'error'
                              ? '오류'
                              : '대기'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {scanError && !isScanning && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 mb-6">
            <p className="text-red-400 font-medium">{scanError}</p>
            <button
              onClick={() => setScanError(null)}
              className="text-sm text-red-400 hover:text-red-300 mt-2 underline"
            >
              닫기
            </button>
          </div>
        )}

        {/* Results */}
        {scanResults && !isScanning && (
          <div className="animate-slideIn">
            <div className="mb-8">
              <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">스캔 결과</h2>
                  <div className="text-right">
                    <div className="text-3xl font-bold gradient-text">
                      {scanResults.riskScore}
                    </div>
                    <div className="text-sm text-gray-400">위험 점수</div>
                  </div>
                </div>

                {/* Sources used */}
                {activeProviderCount > 0 && (
                  <div className="mb-4 text-xs text-gray-500">
                    스캔 소스: XposedOrNot (무료){' '}
                    {getActiveProviders().map((id) => {
                      const p = PROVIDERS.find((pr) => pr.id === id);
                      return p ? `+ ${p.name}` : '';
                    }).join(' ')}
                  </div>
                )}

                <div className={`rounded-lg p-4 mb-6 ${
                  scanResults.findings.length === 0
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-dark-border/50'
                }`}>
                  <p className={`${
                    scanResults.findings.length === 0
                      ? 'text-green-400 font-semibold'
                      : 'text-gray-300'
                  }`}>
                    <strong>{scanResults.findings.length}</strong>건의 유출이
                    발견되었습니다.
                  </p>
                  {scanResults.findings.length === 0 && (
                    <p className="text-green-400 text-sm mt-2">
                      축하합니다! 어떤 유출도 발견되지 않았습니다.
                    </p>
                  )}
                </div>

                {scanResults.findings.length > 0 && (
                  <div className="space-y-4">
                    {scanResults.findings.map((finding) => (
                      <FindingCard
                        key={finding.id}
                        finding={finding}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => {
                  setScanResults(null);
                  setScanError(null);
                }}
                className="flex-1 px-6 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-semibold hover:border-primary transition-smooth"
              >
                다시 스캔
              </button>
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-smooth text-center"
              >
                대시보드로 이동
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!scanResults && !isScanning && user && scanLimit.allowed && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              위의 양식을 작성하고 스캔을 시작하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { supabase, signInWithGoogle, canScan, recordScan } from '@/lib/supabase';
import ScanForm from '@/components/ScanForm';
import FindingCard from '@/components/FindingCard';
import { ArrowLeft, Lock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import type { ScanInput } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

export default function ScanPage() {
  const {
    isScanning,
    scanProgress,
    scanResults,
    setIsScanning,
    setScanProgress,
    setScanResults,
    setFindings,
    addRemovalRequest,
  } = useAppStore();

  const [user, setUser] = useState<User | null>(null);
  const [scanLimit, setScanLimit] = useState({ allowed: true, remaining: 2, nextReset: new Date() });
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    // Check scan limit
    setScanLimit(canScan());

    return () => subscription.unsubscribe();
  }, []);

  const handleScan = async (data: ScanInput) => {
    // Check login
    if (!user) return;

    // Check scan limit
    const status = canScan();
    if (!status.allowed) {
      setScanLimit(status);
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanError(null);

    // Animate progress for 3-4 seconds while API call happens
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      if (currentProgress >= 95) {
        clearInterval(progressInterval);
        return;
      }
      currentProgress = Math.min(95, currentProgress + Math.random() * 20);
      setScanProgress(currentProgress);
    }, 300);

    try {
      // Call the real API
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('스캔 API 호출 실패');
      }

      const apiData = await response.json();

      if (!apiData.success) {
        throw new Error(apiData.message || '스캔 중 오류가 발생했습니다.');
      }

      // Complete the progress animation
      setScanProgress(100);

      // Record scan usage
      recordScan();
      setScanLimit(canScan());

      // Set results with real API data
      setScanResults({
        input: data,
        findings: apiData.findings || [],
        timestamp: new Date().toISOString(),
        riskScore: apiData.riskScore || 0,
      });

      setFindings(apiData.findings || []);
    } catch (error) {
      clearInterval(progressInterval);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setScanError(errorMessage);
      console.error('Scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleRemove = (findingId: string) => {
    addRemovalRequest({
      id: 'req_' + Math.random().toString(36).substr(2, 9),
      findingId,
      status: '대기중',
      createdAt: new Date().toISOString(),
      progress: 0,
      requestType: 'automatic',
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-primary transition-smooth mb-6"
          >
            <ArrowLeft size={20} />
            <span>돌아가기</span>
          </Link>
          <h1 className="text-4xl font-bold mb-2">개인정보 유출 확인</h1>
          <p className="text-gray-400">
            당신의 개인정보가 유출되었는지 지금 바로 확인해보세요.
          </p>
        </div>

        {/* Login Required */}
        {!user ? (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center mb-12">
            <Lock size={48} className="mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-3">Google 로그인 필요</h2>
            <p className="text-gray-400 mb-6">
              스팸 방지를 위해 Google 로그인 후 스캔할 수 있습니다.
            </p>
            <button
              onClick={() => signInWithGoogle()}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-smooth font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google로 로그인</span>
            </button>
            <p className="text-xs text-gray-500 mt-4">
              주 2회 무료 스캔 • 개인정보는 저장하지 않습니다
            </p>
          </div>
        ) : (
          <>
            {/* Scan Limit Warning */}
            {!scanLimit.allowed && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5 mb-6 flex items-start space-x-3">
                <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-yellow-300 font-medium">주간 스캔 한도 도달</p>
                  <p className="text-sm text-gray-400 mt-1">
                    이번 주 스캔 2회를 모두 사용했습니다.{' '}
                    {scanLimit.nextReset.toLocaleDateString('ko-KR')}에 초기화됩니다.
                  </p>
                </div>
              </div>
            )}

            {/* Scan Remaining */}
            {scanLimit.allowed && !isScanning && !scanResults && (
              <div className="mb-6 text-sm text-gray-400">
                이번 주 남은 스캔: <strong className="text-primary">{scanLimit.remaining}회</strong> / 2회
              </div>
            )}

            {/* Scan Form */}
            {!isScanning && !scanResults && (
              <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism mb-12">
                <h2 className="text-2xl font-semibold mb-6">정보 입력</h2>
                <ScanForm
                  onSubmit={handleScan}
                  isLoading={isScanning}
                />
              </div>
            )}
          </>
        )}

        {/* Scanning Progress */}
        {isScanning && (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism mb-12">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-6">스캔 진행 중...</h2>
              <div className="w-full bg-dark-border rounded-full h-2 overflow-hidden mb-4">
                <div
                  className="bg-gradient-primary h-full transition-all duration-300"
                  style={{ width: `${Math.min(scanProgress, 100)}%` }}
                />
              </div>
              <p className="text-gray-400 text-sm">
                {Math.floor(Math.min(scanProgress, 100))}% 완료
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {scanError && !isScanning && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 mb-6">
            <p className="text-red-400 font-medium">{scanError}</p>
            <button
              onClick={() => setScanError(null)}
              className="text-sm text-red-400 hover:text-red-300 mt-2 underline"
            >
              닫기
            </button>
          </div>
        )}

        {/* Results */}
        {scanResults && !isScanning && (
          <div className="animate-slideIn">
            <div className="mb-8">
              <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">스캔 결과</h2>
                  <div className="text-right">
                    <div className="text-3xl font-bold gradient-text">
                      {scanResults.riskScore}
                    </div>
                    <div className="text-sm text-gray-400">위험 점수</div>
                  </div>
                </div>

                <div className={`rounded-lg p-4 mb-6 ${
                  scanResults.findings.length === 0
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-dark-border/50'
                }`}>
                  <p className={`${
                    scanResults.findings.length === 0
                      ? 'text-green-400 font-semibold'
                      : 'text-gray-300'
                  }`}>
                    <strong>{scanResults.findings.length}</strong>건의 유출이
                    발견되었습니다.
                  </p>
                  {scanResults.findings.length === 0 && (
                    <p className="text-green-400 text-sm mt-2">
                      축하합니다! 어떤 유출도 발견되지 않았습니다.
                    </p>
                  )}
                </div>

                {scanResults.findings.length > 0 && (
                  <div className="space-y-4">
                    {scanResults.findings.map((finding) => (
                      <FindingCard
                        key={finding.id}
                        finding={finding}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => {
                  setScanResults(null);
                  setScanError(null);
                }}
                className="flex-1 px-6 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-semibold hover:border-primary transition-smooth"
              >
                다시 스캔
              </button>
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-smooth text-center"
              >
                대시보드로 이동
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!scanResults && !isScanning && user && scanLimit.allowed && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              위의 양식을 작성하고 스캔을 시작하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
