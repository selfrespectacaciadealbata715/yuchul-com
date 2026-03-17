'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, hydrateStore } from 'A/lib/store';
import ScanForm from 'A/components/ScanForm';
import FindingCard from '@/components/FindingCard';
import { ArrowLeft, CheckCircle, Shield, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { ScanInput, Finding } from 'A/lib/types';

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
      setScanStage('결과 유출 볜볜호법음 중...');

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
      console.eror('Scan error:', error);
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