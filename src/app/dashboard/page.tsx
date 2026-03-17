'use client';

import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import RiskGauge from '@/components/RiskGauge';
import Link from 'next/link';
import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Finding, RemovalRequest } from '@/lib/types';

export default function DashboardPage() {
  const { findings, removalRequests } = useAppStore();
  const [dashboardData, setDashboardData] = useState({
    riskScore: 72,
    totalBreaches: 2,
    removalableBreach: 2,
    removalQueueCount: 1,
  });

  useEffect(() => {
    // Update dashboard data based on store
    setDashboardData({
      riskScore: findings.length > 0 ? 72 : 18,
      totalBreaches: findings.length,
      removalableBreach: findings.filter((f) => f.status === 'new').length,
      removalQueueCount: removalRequests.filter(
        (r) => r.status !== '완료'
      ).length,
    });
  }, [findings, removalRequests]);

  const getRecentFindings = () => findings.slice(0, 5);
  const getRecentRequests = () => removalRequests.slice(0, 5);

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">대시보드</h1>
        <p className="text-gray-400">
          당신의 개인정보 보안 상태를 한눈에 확인하세요.
        </p>
      </div>

      {/* Risk Score Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1 bg-dark-card border border-dark-border rounded-2xl p-8 flex flex-col items-center justify-center glass-morphism">
          <RiskGauge score={dashboardData.riskScore} size="md" />
        </div>

        {/* Summary Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Breaches */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 glass-morphism hover:border-primary/50 transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  확인된 유출
                </p>
                <h3 className="text-3xl font-bold">
                  {dashboardData.totalBreaches}
                </h3>
              </div>
              <AlertCircle className="text-danger" size={24} />
            </div>
            <p className="text-xs text-gray-500">
              {dashboardData.totalBreaches > 0
                ? '즉시 조치가 필요합니다'
                : '안전한 상태입니다'}
            </p>
          </div>

          {/* Removable Breaches */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 glass-morphism hover:border-primary/50 transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  삭제 가능
                </p>
                <h3 className="text-3xl font-bold">
                  {dashboardData.removalableBreach}
                </h3>
              </div>
              <CheckCircle className="text-success" size={24} />
            </div>
            <Link
              href="/dashboard/removal"
              className="text-xs text-primary hover:underline"
            >
              삭제 요청하기 →
            </Link>
          </div>

          {/* Removal Queue */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 glass-morphism hover:border-primary/50 transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  처리 중인 요청
                </p>
                <h3 className="text-3xl font-bold">
                  {dashboardData.removalQueueCount}
                </h3>
              </div>
              <Clock className="text-warning" size={24} />
            </div>
            <p className="text-xs text-gray-500">
              {dashboardData.removalQueueCount > 0
                ? '처리중입니다'
                : '완료된 상태입니다'}
            </p>
          </div>

          {/* Last Scan */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 glass-morphism hover:border-primary/50 transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  마지막 스캔
                </p>
                <h3 className="text-sm text-white">
                  {new Date().toLocaleDateString('ko-KR')}
                </h3>
              </div>
              <TrendingUp className="text-primary" size={24} />
            </div>
            <Link
              href="/scan"
              className="text-xs text-primary hover:underline"
            >
              다시 스캔하기 →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Findings List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">최근 발견</h2>
            {getRecentFindings().length > 0 && (
              <Link
                href="/dashboard/findings"
                className="text-sm text-primary hover:underline"
              >
                전체보기 →
              </Link>
            )}
          </div>

          {getRecentFindings().length > 0 ? (
            <div className="space-y-3">
              {getRecentFindings().map((finding) => (
                <div
                  key={finding.id}
                  className="bg-dark-card border border-dark-border rounded-lg p-4 hover:border-primary/50 transition-smooth"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white mb-1">
                        {finding.source}
                      </p>
                      <p className="text-sm text-gray-400">
                        {finding.description}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        finding.riskLevel === '높음'
                          ? 'bg-danger/20 text-danger'
                          : finding.riskLevel === '중간'
                            ? 'bg-warning/20 text-warning'
                            : 'bg-success/20 text-success'
                      }`}
                    >
                      {finding.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-dark-card border border-dark-border rounded-lg p-8 text-center">
              <p className="text-gray-400">아직 발견된 유출이 없습니다.</p>
              <Link
                href="/scan"
                className="text-sm text-primary hover:underline mt-4 inline-block"
              >
                지금 스캔하기
              </Link>
            </div>
          )}
        </div>

        {/* Removal Requests */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">삭제 요청</h2>
            {getRecentRequests().length > 0 && (
              <Link
                href="/dashboard/removal"
                className="text-sm text-primary hover:underline"
              >
                전체보기 →
              </Link>
            )}
          </div>

          {getRecentRequests().length > 0 ? (
            <div className="space-y-3">
              {getRecentRequests().map((request) => (
                <div
                  key={request.id}
                  className="bg-dark-card border border-dark-border rounded-lg p-4 hover:border-primary/50 transition-smooth"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-white">
                      요청 #{request.id.slice(-4)}
                    </p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        request.status === '완료'
                          ? 'bg-success/20 text-success'
                          : request.status === '진행중'
                            ? 'bg-warning/20 text-warning'
                            : 'bg-primary/20 text-primary'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-dark-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all duration-300"
                      style={{ width: `${request.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(request.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-dark-card border border-dark-border rounded-lg p-8 text-center">
              <p className="text-gray-400">아직 삭제 요청이 없습니다.</p>
              <Link
                href="/scan"
                className="text-sm text-primary hover:underline mt-4 inline-block"
              >
                지금 스캔하기
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism">
        <h2 className="text-xl font-semibold mb-6">빠른 작업</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <Link
            href="/scan"
            className="flex-1 px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-smooth text-center"
          >
            새로운 스캔 시작
          </Link>
          <Link
            href="/dashboard/findings"
            className="flex-1 px-6 py-3 bg-dark-border text-white font-semibold rounded-lg hover:border-primary transition-smooth text-center border border-dark-border"
          >
            유출 현황 보기
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex-1 px-6 py-3 bg-dark-border text-white font-semibold rounded-lg hover:border-primary transition-smooth text-center border border-dark-border"
          >
            설정
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
