'use client';

import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import RiskGauge from '@/components/RiskGauge';
import Link from 'next/link';
import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { findings, removalRequests } = useAppStore();
  const [dashboardData, setDashboardData] = useState({
    riskScore: 0,
    totalBreaches: 0,
    removalableBreach: 0,
    removalQueueCount: 0,
  });

  // Calculate risk score dynamically based on findings
  const calculateRiskScore = (findingsList: typeof findings): number => {
    if (findingsList.length === 0) return 0;

    let score = 0;
    findingsList.forEach((finding) => {
      // Base points for each finding
      score += 15;
      // Additional points based on risk level
      if (finding.riskLevel === 'ëì') {
        score += 20;
      } else if (finding.riskLevel === 'ì¤ê°') {
        score += 10;
      } else if (finding.riskLevel === 'ë®ì') {
        score += 5;
      }
    });

    // Cap at 100
    return Math.min(score, 100);
  };

  useEffect(() => {
    // Update dashboard data based on store
    setDashboardData({
      riskScore: calculateRiskScore(findings),
      totalBreaches: findings.length,
      removalableBreach: findings.filter((f) => f.status === 'new').length,
      removalQueueCount: removalRequests.filter(
        (r) => r.status !== 'ìë£'
      ).length,
    });
  }, [findings, removalRequests]);

  const getRecentFindings = () => findings.slice(0, 5);
  const getRecentRequests = () => removalRequests.slice(0, 5);

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ëìë³´ë</h1>
        <p className="text-gray-400">
          ë¹ì ì ê°ì¸ì ë³´ ë³´ì ìíë¥¼ íëì íì¸íì¸ì.
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
                  íì¸ë ì ì¶
                </p>
                <h3 className="text-3xl font-bold">
                  {dashboardData.totalBreaches}
                </h3>
              </div>
              <AlertCircle className="text-danger" size={24} />
            </div>
            <p className="text-xs text-gray-500">
              {dashboardData.totalBreaches > 0
                ? 'ì¦ì ì¡°ì¹ê° íìí©ëë¤'
                : 'ìì í ìíìëë¤'}
            </p>
          </div>

          {/* Removable Breaches */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 glass-morphism hover:border-primary/50 transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  ì­ì  ê°ë¥
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
              ì­ì  ìì²­íê¸° â
            </Link>
          </div>

          {/* Removal Queue */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 glass-morphism hover:border-primary/50 transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  ì²ë¦¬ ì¤ì¸ ìì²­
                </p>
                <h3 className="text-3xl font-bold">
                  {dashboardData.removalQueueCount}
                </h3>
              </div>
              <Clock className="text-warning" size={24} />
            </div>
            <p className="text-xs text-gray-500">
              {dashboardData.removalQueueCount > 0
                ? 'ì²ë¦¬ì¤ìëë¤'
                : 'ìë£ë ìíìëë¤'}
            </p>
          </div>

          {/* Last Scan */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 glass-morphism hover:border-primary/50 transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  ë§ì§ë§ ì¤ìº
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
              ë¤ì ì¤ìºíê¸° â
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Findings List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">ìµê·¼ ë°ê²¬</h2>
            {getRecentFindings().length > 0 && (
              <Link
                href="/dashboard/findings"
                className="text-sm text-primary hover:underline"
              >
                ì ì²´ë³´ê¸° â
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
                        finding.riskLevel === 'ëì'
                          ? 'bg-danger/20 text-danger'
                          : finding.riskLevel === 'ì¤ê°'
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
              <p className="text-gray-400">ìì§ ë°ê²¬ë ì ì¶ì´ ììµëë¤.</p>
              <Link
                href="/scan"
                className="text-sm text-primary hover:underline mt-4 inline-block"
              >
                ì§ê¸ ì¤ìºíê¸°
              </Link>
            </div>
          )}
        </div>

        {/* Removal Requests */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">ì­ì  ìì²­</h2>
            {getRecentRequests().length > 0 && (
              <Link
                href="/dashboard/removal"
                className="text-sm text-primary hover:underline"
              >
                ì ì²´ë³´ê¸° â
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
                      ìì²­ #{request.id.slice(-4)}
                    </p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        request.status === 'ìë£'
                          ? 'bg-success/20 text-success'
                          : request.status === 'ì§íì¤'
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
              <p className="text-gray-400">ìì§ ì­ì  ìì²­ì´ ììµëë¤.</p>
              <Link
                href="/scan"
                className="text-sm text-primary hover:underline mt-4 inline-block"
              >
                ì§ê¸ ì¤ìºíê¸°
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism">
        <h2 className="text-xl font-semibold mb-6">ë¹ ë¥¸ ìì</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <Link
            href="/scan"
            className="flex-1 px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-smooth text-center"
          >
            ìë¡ì´ ì¤ìº ìì
          </Link>
          <Link
            href="/dashboard/findings"
            className="flex-1 px-6 py-3 bg-dark-border text-white font-semibold rounded-lg hover:border-primary transition-smooth text-center border border-dark-border"
          >
            ì ì¶ íí© ë³´ê¸°
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex-1 px-6 py-3 bg-dark-border text-white font-semibold rounded-lg hover:border-primary transition-smooth text-center border border-dark-border"
          >
            ì¤ì 
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
