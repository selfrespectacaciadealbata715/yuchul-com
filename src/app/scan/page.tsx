'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { supabase, signInWithGoogle, canScan, recordScan } from '@/lib/supabase';
import ScanForm from '@/components/ScanForm';
import FindingCard from '@/components/FindingCard';
import LoadingWithAd from '@/components/LoadingWithAd';
import { ArrowLeft, Lock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import type { ScanInput, Finding } from '@/lib/types';
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
    const mockFindings: Finding[] = [
      {
        id: '1',
        source: 'Collection #1',
        type: '\uB2E4\uD06C\uC6F9',
        dateFound: '2024-01-15',
        riskLevel: '\uB192\uC74C',
        exposedData: ['\uC774\uBA54\uC77C', '\uBE44\uBC00\uBC88\uD638'],
        description: '\uC54C\uB824\uC9C4 \uB300\uADDC\uBAA8 \uB370\uC774\uD130 \uC720\uCD9C\uC5D0\uC11C \uBC1C\uACAC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.',
        status: 'new' as const,
      },
      {
        id: '2',
        source: '123RF \uC720\uCD9C',
        type: '\uB2E4\uD06C\uC6F9',
        dateFound: '2024-02-10',
        riskLevel: '\uC911\uAC04',
        exposedData: ['\uC774\uBA54\uC77C', '\uC774\uB984', '\uC804\uD654\uBC88\uD638'],
        description: '123RF \uC6F9\uC0AC\uC774\uD2B8\uC5D0\uC11C \uC720\uCD9C\uB41C \uC815\uBCF4',
        status: 'new' as const,
      },
      {
        id: '3',
        source: '\uB124\uC774\uBC84 \uAC80\uC0C9\uACB0\uACFC',
        type: '\uC11C\uD53C\uC2A4\uC6F9',
        dateFound: '2024-03-01',
        riskLevel: '\uC911\uAC04',
        exposedData: ['\uC774\uB984', '\uC774\uBA54\uC77C'],
        description: '\uB124\uC774\uBC84 \uAC80\uC0C9 \uACB0\uACFC\uC5D0 \uAC1C\uC778\uC815\uBCF4\uAC00 \uB178\uCD9C\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.',
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
      status: '\uB300\uAE30\uC911',
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
            <span>{'\uB3CC\uC544\uAC00\uAE30'}</span>
          </Link>
          <h1 className="text-4xl font-bold mb-2">{'\uAC1C\uC778\uC815\uBCF4 \uC720\uCD9C \uD655\uC778'}</h1>
          <p className="text-gray-400">
            {'\uBE44\uC2E0\uC758 \uAC1C\uC778\uC815\uBCF4\uAC00 \uC720\uCD9C\uB418\uC5C8\uB294\uC9C0 \uC9C0\uAE08 \uBC14\uB85C \uD655\uC778\uD574\uBCF4\uC138\uC694.'}
          </p>
        </div>

        {/* Login Required */}
        {!user ? (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center mb-12">
            <Lock size={48} className="mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-3">{'Google \uB85C\uADF8\uC778 \uD544\uC694'}</h2>
            <p className="text-gray-400 mb-6">
              {'\uC2A4\uD338 \uBC29\uC9C0\uB97C \uC704\uD574 Google \uB85C\uADF8\uC778 \uD6C4 \uC2A4\uCE94\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.'}
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
              <span>{'Google\uB85C \uB85C\uADF8\uC778'}</span>
            </button>
            <p className="text-xs text-gray-500 mt-4">
              {'\uC8FC 2\uD68C \uBB34\uB8CC \uC2A4\uCE94 \u2022 \uAC1C\uC778\uC815\uBCF4\uB294 \uC800\uC7A5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4'}
            </p>
          </div>
        ) : (
          <>
            {/* Scan Limit Warning */}
            {!scanLimit.allowed && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5 mb-6 flex items-start space-x-3">
                <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-yellow-300 font-medium">{'\uC8FC\uAC04 \uC2A4\uCE94 \uD55C\uB3C4 \uB3C4\uB2EC'}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {'\uC774\uBC88 \uC8FC \uC2A4\uCE94 2\uD68C\uB97C \uBAA8\uB450 \uC0AC\uC6A9\uD558\uC600\uC2B5\uB2C8\uB2E4. '}
                    {scanLimit.nextReset.toLocaleDateString('ko-KR')}{'\uC5D0 \uCD08\uAE30\uD654\uB429\uB2C8\uB2E4.'}
                  </p>
                </div>
              </div>
            )}

            {/* Scan Remaining */}
            {scanLimit.allowed && !isScanning && !scanResults && (
              <div className="mb-6 text-sm text-gray-400">
                {'\uC774\uBC88 \uC8FC \uB0A8\uC740 \uC2A4\uCE94: '}<strong className="text-primary">{scanLimit.remaining}{'\uD68C'}</strong> / 2{'\uD68C'}
              </div>
            )}

            {/* Scan Form */}
            {!isScanning && !scanResults && (
              <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism mb-12">
                <h2 className="text-2xl font-semibold mb-6">{'\uC815\uBCF4 \uC785\uB825'}</h2>
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
                  <h2 className="text-2xl font-semibold">{'\uC2A4\uCE94 \uACB0\uACFC'}</h2>
                  <div className="text-right">
                    <div className="text-3xl font-bold gradient-text">
                      {scanResults.riskScore}
                    </div>
                    <div className="text-sm text-gray-400">{'\uC704\uD5D8 \uC810\uC218'}</div>
                  </div>
                </div>

                <div className="bg-dark-border/50 rounded-lg p-4 mb-6">
                  <p className="text-gray-300">
                    <strong>{scanResults.findings.length}</strong>{'\uAC74\uC758 \uC720\uCD9C\uC774 \uBC1C\uACAC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.'}
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
                  setScanResults(null as unknown as Parameters<typeof setScanResults>[0]);
                }}
                className="flex-1 px-6 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-semibold hover:border-primary transition-smooth"
              >
                {'\uB2E4\uC2DC \uC2A4\uCE94'}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-smooth text-center"
              >
                {'\uB300\uC2DC\uBCF4\uB4DC\uB85C \uC774\uB3D9'}
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!scanResults && !isScanning && user && scanLimit.allowed && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {'\uC704\uC5D0 \uC591\uC2DD\uC744 \uC791\uC131\uD558\uACE0 \uC2A4\uCE94\uC744 \uC2DC\uC791\uD558\uC138\uC694.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
