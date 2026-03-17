'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { supabase, signInWithGoogle, canScan, recordScan } from '@/lib/supabase';
import ScanForm from '@/components/ScanForm';
import FindingCard from '@/components/FindingCard';
import LoadingWithAd from '@/components/LoadingWithAd';
import { ArrowLeft, Lock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import type { ScanInput } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

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

    // Intentionally longer loading (8 seconds total) for ad display
    const totalSteps = 80;
    for (let i = 0; i <= totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setScanProgress(Math.floor((i / totalSteps) * 100));
    }

    // Record scan usage
    recordScan();
    setScanLimit(canScan());

    // Mock results
    const mockFindings = [
      {
        id: '1',
        source: 'Collection #1',
        type: 'ë¤í¬ì¹' as const,
        dateFound: '2024-01-15',
        riskLevel: 'ëì' as const,
        exposedData: ['ì´ë©ì¼', 'ë¹ë°ë²í¸'],
        description: 'ìë ¤ì§ ëê·ëª¨ ë°ì´í° ì ì¶ìì ë°ê²¬ëììµëë¤.',
        status: 'new' as const,
      },
      {
        id: '2',
        source: '123RF ì ì¶',
        type: 'ë¤í¬ì¹' as const,
        dateFound: '2024-02-10',
        riskLevel: 'ì¤ê°' as const,
        exposedData: ['ì´ë©ì¼', 'ì´ë¦', 'ì íë²í¸'],
        description: '123RF ì¹ì¬ì´í¸ìì ì ì¶ë ì ë³´',
        status: 'new' as const,
      },
      {
        id: '3',
        source: 'ë¤ì´ë² ê²ìê²°ê³¼',
        type: 'ìí¼ì¤ì¹' as const,
        dateFound: '2024-03-01',
        riskLevel: 'ì¤ê°' as const,
        exposedData: ['ì´ë¦', 'ì´ë©ì¼'],
        description: 'ë¤ì´ë² ê²ì ê²°ê³¼ì ê°ì¸ì ë³´ê° ë¸ì¶ëì´ ììµëë¤.',
        status: 'new' as const,
      },
    ];

    setScanResults({
      input: data,
      findings: mockFindings,
      timestamp: new Date().toISOString(),
      riskScore: 72,
    });

    setFindings(mockFindings);
    setIsScanning(false);
  };

  const handleRemove = (findingId: string) => {
    addRemovalRequest({
      id: 'req_' + Math.random().toString(36).substr(2, 9),
      findingId,
      status: 'ëê¸°ì¤',
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
            <span>ëìê°ê¸°</span>
          </Link>
          <h1 className="text-4xl font-bold mb-2">ê°ì¸ì ë³´ ì ì¶ íì¸</h1>
          <p className="text-gray-400">
            ë¹ì ì ê°ì¸ì ë³´ê° ì ì¶ëìëì§ ì§ê¸ ë°ë¡ íì¸í´ë³´ì¸ì.
          </p>
        </div>

        {/* Login Required */}
        {!user ? (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center mb-12">
            <Lock size={48} className="mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-3">Google ë¡ê·¸ì¸ íì</h2>
            <p className="text-gray-400 mb-6">
              ì¤í¸ ë°©ì§ë¥¼ ìí´ Google ë¡ê·¸ì¸ í ì¤ìºí  ì ììµëë¤.
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
              <span>Googleë¡ ë¡ê·¸ì¸</span>
            </button>
            <p className="text-xs text-gray-500 mt-4">
              ì£¼ 2í ë¬´ë£ ì¤ìº â¢ ê°ì¸ì ë³´ë ì ì¥íì§ ììµëë¤
            </p>
          </div>
        ) : (
          <>
            {/* Scan Limit Warning */}
            {!scanLimit.allowed && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5 mb-6 flex items-start space-x-3">
                <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-yellow-300 font-medium">ì£¼ê° ì¤ìº íë ëë¬</p>
                  <p className="text-sm text-gray-400 mt-1">
                    ì´ë² ì£¼ ì¤ìº 2íë¥¼ ëª¨ë ì¬ì©íìµëë¤.{' '}
                    {scanLimit.nextReset.toLocaleDateString('ko-KR')}ì ì´ê¸°íë©ëë¤.
                  </p>
                </div>
              </div>
            )}

            {/* Scan Remaining */}
            {scanLimit.allowed && !isScanning && !scanResults && (
              <div className="mb-6 text-sm text-gray-400">
                ì´ë² ì£¼ ë¨ì ì¤ìº: <strong className="text-primary">{scanLimit.remaining}í</strong> / 2í
              </div>
            )}

            {/* Scan Form */}
            {!isScanning && !scanResults && (
              <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism mb-12">
                <h2 className="text-2xl font-semibold mb-6">ì ë³´ ìë ¥</h2>
                <ScanForm
                  onSubmit={handleScan}
                  isLoading={isScanning}
                />
              </div>
            )}
          </>
        )}

        {/* Scanning Progress with Ads */}
        {isScanning && (
          <LoadingWithAd progress={scanProgress} type="scan" />
        )}

        {/* Results */}
        {scanResults && !isScanning && (
          <div className="animate-slideIn">
            <div className="mb-8">
              <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">ì¤ìº ê²°ê³¼</h2>
                  <div className="text-right">
                    <div className="text-3xl font-bold gradient-text">
                      {scanResults.riskScore}
                    </div>
                    <div className="text-sm text-gray-400">ìí ì ì</div>
                  </div>
                </div>

                <div className="bg-dark-border/50 rounded-lg p-4 mb-6">
                  <p className="text-gray-300">
                    <strong>{scanResults.findings.length}</strong>ê±´ì ì ì¶ì´
                    ë°ê²¬ëììµëë¤.
                  </p>
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
                }}
                className="flex-1 px-6 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-semibold hover:border-primary transition-smooth"
              >
                ë¤ì ì¤ìº
              </button>
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-smooth text-center"
              >
                ëìë³´ëë¡ ì´ë
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!scanResults && !isScanning && user && scanLimit.allowed && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              ìì ììì ìì±íê³  ì¤ìºì ììíì¸ì.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
