'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, hydrateStore } from '@/lib/store';
import ScanForm from '@/components/ScanForm';
import FindingCard from '@/components/FindingCard';
import { ArrowLeft, CheckCircle, Shield, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { ScanInput, Finding } from '@/lib/types';

export default function ScanPage() {
  const router = useRouter();
  const {
    isScanning,
    scanProgress,
    scanResults,
    pendingScanInput,
    setIsScanning,
    setScanProgress,
    setScanResults,
    setFindings,
    addRemovalRequest,
    setPendingScanInput,
  } = useAppStore();

  const [scanStage, setScanStage] = useState('');
  const [autoScanning, setAutoScanning] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    hydrateStore();
  }, []);

  // Auto-scan if there's pending input from home page
  useEffect(() => {
    const pending = useAppStore.getState().pendingScanInput;
    if (pending && !autoScanning && !isScanning && !scanResults) {
      setAutoScanning(true);
      handleScan(pending);
    }
  }, [pendingScanInput]);

  const handleScan = async (data: ScanInput) => {
    if (!data.email && !data.phone && !data.name && !data.username) return;

    setIsScanning(true);
    setScanProgress(0);
    setScanStage('유출 데이터베이스 연결 중...');

    // Animated progress
    const progressStages = [
      { pct: 10, msg: '다크웹 데이터베이스 검색 중...' },
      { pct: 30, msg: 'XposedOrNot API 조회 중...' },
      { pct: 50, msg: '유출 기록 분석 중...' },
      { pct: 70, msg: '데이터브로커 확인 중...' },
      { pct: 85, msg: '결과 정리 중...' },
    ];

    let currentStage = 0;
    const progressInterval = setInterval(() => {
      if (currentStage < progressStages.length) {
        setScanProgress(progressStages[currentStage].pct);
        setScanStage(progressStages[currentStage].msg);
        currentStage++;
      }
    }, 1500);

    try {
      // Call real API
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      clearInterval(progressInterval);
      setScanProgress(95);
      setScanStage('결과 처리 중...');

      const result = await response.json();

      await new Promise((r) => setTimeout(r, 500));
      setScanProgress(100);

      if (result.success) {
        const scanResult = {
          input: data,
          findings: result.findings || [],
          timestamp: new Date().toISOString(),
          riskScore: result.riskScore || 0,
        };

        setScanResults(scanResult);
        setFindings(result.findings || []);
      } else {
        setScanResults({
          input: data,
          findings: [],
          timestamp: new Date().toISOString(),
          riskScore: 0,
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Scan error:', error);
      setScanResults({
        input: data,
        findings: [],
        timestamp: new Date().toISOString(),
        riskScore: 0,
      });
    } finally {
      setIsScanning(false);
      setAutoScanning(false);
      setPendingScanInput(null);
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
    <div className="min-h-screen bg-dark-bg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-primary transition-smooth mb-4"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">돌아가기</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            개인정보 유출 스캔
          </h1>
          <p className="text-gray-400">
            이메일 주소로 다크웹 및 데이터브로커에서 유출 여부를 확인합니다.
          </p>
        </div>

        {/* Scan Form - always visible unless scanning or results */}
        {!isScanning && !scanResults && (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="text-primary" size={22} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">정보 입력</h2>
                <p className="text-sm text-gray-500">이메일은 필수입니다</p>
              </div>
            </div>
            <ScanForm onSubmit={handleScan} isLoading={isScanning} />
          </div>
        )}

        {/* Scanning Progress */}
        {isScanning && (
          <div className="bg-dark-card border border-primary/20 rounded-2xl p-8 mb-8 animate-slideIn">
            <div className="flex items-center space-x-3 mb-6">
              <Loader2 size={24} className="text-primary animate-spin" />
              <h3 className="text-xl font-semibold">스캔 진행 중</h3>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">{scanStage}</span>
                <span className="text-primary font-medium">{scanProgress}%</span>
              </div>
              <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all duration-700 ease-out"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {scanProgress >= 10 && (
                <div className="flex items-center space-x-2 text-gray-300 animate-slideIn">
                  <CheckCircle size={16} className="text-success" />
                  <span>다크웹 데이터베이스 검색</span>
                </div>
              )}
              {scanProgress >= 30 && (
                <div className="flex items-center space-x-2 text-gray-300 animate-slideIn">
                  <CheckCircle size={16} className="text-success" />
                  <span>XposedOrNot API 조회</span>
                </div>
              )}
              {scanProgress >= 50 && (
                <div className="flex items-center space-x-2 text-gray-300 animate-slideIn">
                  <CheckCircle size={16} className="text-success" />
                  <span>유출 기록 분석</span>
                </div>
              )}
              {scanProgress >= 70 && (
                <div className="flex items-center space-x-2 text-gray-300 animate-slideIn">
                  <CheckCircle size={16} className="text-success" />
                  <span>데이터브로커 확인</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {scanResults && !isScanning && (
          <div className="animate-slideIn space-y-6">
            {/* Summary Card */}
            <div className={`rounded-2xl p-8 border ${
              scanResults.findings.length > 0
                ? 'bg-danger/5 border-danger/20'
                : 'bg-success/5 border-success/20'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {scanResults.findings.length > 0 ? (
                    <AlertTriangle className="text-danger" size={28} />
                  ) : (
                    <CheckCircle className="text-success" size={28} />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">
                      {scanResults.findings.length > 0
                        ? `${scanResults.findings.length}건의 유출 발견`
                        : '유출이 발견되지 않았습니다'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {scanResults.input.email} 검색 결과
                    </p>
                  </div>
                </div>
                {scanResults.findings.length > 0 && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-danger">
                      {scanResults.riskScore}
                    </div>
                    <div className="text-xs text-gray-400">위험 점수</div>
                  </div>
                )}
              </div>

              {scanResults.findings.length > 0 && (
                <p className="text-sm text-gray-400">
                  발견된 유출에 대해 삭제 요청을 보낼 수 있습니다. 아래에서 각 항목을 확인하세요.
                </p>
              )}
            </div>

            {/* Findings List */}
            {scanResults.findings.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">유출 상세 내역</h3>
                {scanResults.findings.map((finding: Finding) => (
                  <FindingCard
                    key={finding.id}
                    finding={finding}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-3 pt-4">
              <button
                onClick={() => {
                  setScanResults(null);
                  setAutoScanning(false);
                }}
                className="flex-1 px-6 py-3 bg-dark-card border border-dark-border rounded-xl text-white font-medium hover:border-primary/50 transition-smooth"
              >
                다시 스캔
              </button>
              {scanResults.findings.length > 0 && (
                <Link
                  href="/dashboard/removal"
                  className="flex-1 px-6 py-3 bg-danger/10 border border-danger/20 text-danger font-medium rounded-xl hover:bg-danger/20 transition-smooth text-center"
                >
                  삭제 요청하기
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-3 bg-gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition-smooth text-center"
              >
                대시보드로 이동
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!scanResults && !isScanning && !pendingScanInput && (
          <div className="text-center py-12">
            <Shield size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">
              이메일 주소를 입력하고 스캔을 시작하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}