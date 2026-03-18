'use client';

import { useEffect, useState } from 'react';
import { useAppStore, hydrateStore } from 'A/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import RiskGauge from '@/components/RiskGauge';
import Link from 'next/link';
import { TrendingUp, AlertCircle, CheckCircle, Clock, Search, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { findings, removalRequests, scanResults } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    hydrateStore();
    setMounted(true);
  }, []);

  const riskScore = scanResults?.riskScore ?? (findings.length > 0 ? 72 : 0);
  const totalBreaches = findings.length;
  const removable = findings.filter((f) => f.status === 'new').length;
  const inQueue = removalRequests.filter((r) => r.status !== '완료').length;

  if (!mounted) return null;

  return (
    <DashboardLayout>
      {/* Scan CTA - Top Priority */}
      <div className="mb-8 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Search className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">새로운 스캔 시작</h2>
              <p className="text-sm text-gray-400">
                {scanResults
                  ? `마지막 스캔: ${new Date(scanResults.timestamp).toLocaleDateString('ko-KR')}`
                  : '아직 스캔한 적이 없습니다'}
              </p>
            </div>
          </div>
          <Link
            href="/scan"
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition-smooth"
          >
            <Search size={18} />
            <span>맀금 스캔하기</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">대시보드</h1>
        <p className="text-gray-400 text-sm">개인정보 보안 상태를 한눈에 확인하세요'</p>
      </div>

      {/* Risk + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex items-center justify-center">
          <RiskGauge score={riskScore} size="md" />
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-primary/30 transition-smooth">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-gray-400 text-xs font-medium mb-1">확인된 유출</p>
                <h3 className="text-2xl font-bold">{totalBreaches}</h3>
              </div>
              <AlertCircle className="text-danger" size={20} />
            </div>
            <p className="text-xs text-gray-500">
              {totalBreaches > 0 ? '조치가 필요합니다' : '안전합니다'}
            </p>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-primary/30 transition-smooth">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-gray-400 text-xs font-medium mb-1">삭제 가능</p>
                <h3 className="text-2xl font-bold">{removable}</h3>
              </div>
              <CheckCircle className="text-success" size={20} />
            </div>
            <Link href="/dashboard/removal" className="text-xs text-primary hover:underline">
              삭제 요청하기 →
            </Link>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-primary/30 transition-smooth">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-gray-400 text-xs font-medium mb-1">처리 중</p>
                <h3 className="text-2xl font-bold">{inQueue}</h3>
              </div>
              <Clock className="text-warning" size={20} />
            </div>
            <p className="text-xs text-gray-500">
              {inQueue > 0 ? '처리중입니다' : '완료'}
            </p>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-primary/30 transition-smooth">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-gray-400 text-xs font-medium mb-1">마지막 스캔</p>
                <h3 className="text-sm text-white font-medium">
                  {scanResults
                    ? new Date(scanResults.timestamp).toLocaleDateString('ko-KR')
                    : '없음'}
                </h3>
              </div>
              <TrendingUp className="text-primary" size={20} />
            </div>
            <Link href="/scan" className="text-xs text-primary hover:underline">
              다시 스캔하기 →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">최근 발견</h2>
            {findings.length > 0 && (
              <Link href="/dashboard/findings" className="text-xs text-primary hover:underline">
                전체보기 →
              </Link>
            )}
          </div>

          {findings.length > 0 ? (
            <div className="space-y-3">
              {findings.slice(0, 5).map((finding) => (
                <div
                  key={finding.id}
                  className="bg-dark-card border border-dark-border rounded-lg p-4 hover:border-primary/30 transition-smooth"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{finding.source}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{finding.description}</p>
                    </div>
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
                      finding.riskLevel === '높음'
                        ? 'bg-danger/20 text-danger'
                        : finding.riskLevel === '중간'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-success/20 text-success'
                    }`}>
                      {finding.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-dark-card border border-dark-border rounded-lg p-8 text-center">
              <p className="text-gray-500 text-sm">발견된 유출이 없습니다.</p>
              <Link href="/scan" className="text-xs text-primary hover:underline mt-2 inline-block">
                지금 스캔하기
              </Link>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">삭제 요청</h2>
            {removalRequests.length > 0 && (
              <Link href="/dashboard/removal" className="text-xs text-primary hover:underline">
                전체보기 →
              </Link>
            )}
          </div>

          {removalRequests.length > 0 ? (
            <div className="space-y-3">
              {removalRequests.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="bg-dark-card border border-dark-border rounded-lg p-4 hover:border-primary/30 transition-smooth"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-white text-sm">요청 #{request.id.slice(-4)}</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      request.status === '완료'
                        ? 'bg-success/20 text-success'
                        : request.status === '진행중'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-primary/20 text-primary'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-dark-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all"
                      style={{ width: `${request.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-dark-card border border-dark-border rounded-lg p-8 text-center">
              <p className="text-gray-500 text-sm">삭제 요청이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  
  
ࠄ ��