'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Download, TrendingDown } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useMemo } from 'react';

export default function ReportPage() {
  const { findings, removalRequests } = useAppStore();

  // Calculate current risk score
  const currentScore = useMemo(() => {
    if (findings.length === 0) return 0;
    let score = 0;
    findings.forEach((finding) => {
      score += 15;
      if (finding.riskLevel === 'ëì') {
        score += 20;
      } else if (finding.riskLevel === 'ì¤ê°') {
        score += 10;
      } else if (finding.riskLevel === 'ë®ì') {
        score += 5;
      }
    });
    return Math.min(score, 100);
  }, [findings]);

  // Get current month's findings and removal requests
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const findingsThisMonth = findings.filter((f) => {
    const date = new Date(f.dateFound);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const removalRequestsThisMonth = removalRequests.filter((r) => {
    const date = new Date(r.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const completedRemovals = removalRequests.filter((r) => r.status === 'ìë£').length;

  const reportData = {
    currentScore,
    previousScore: currentScore > 0 ? Math.max(0, currentScore - 15) : 0,
    scoreChange: currentScore > 0 ? 15 : 0,
    totalScans: findings.length,
    findingsThisMonth,
    removalRequestsThisMonth,
    completedRemovals,
  };

  // Score history - show just current score since we don't have historical data
  const scoreHistory = [
    { month: 'ì´ì ', score: reportData.previousScore },
    { month: 'íì¬', score: currentScore },
  ];

  // Generate events from findings and removal requests
  const events = useMemo(() => {
    const eventList: Array<{
      date: string;
      event: string;
      type: 'finding' | 'removal' | 'report';
    }> = [];

    findings.forEach((f) => {
      eventList.push({
        date: f.dateFound,
        event: `ìë¡ì´ ì ì¶ ë°ê²¬: ${f.source}`,
        type: 'finding',
      });
    });

    removalRequests.forEach((r) => {
      if (r.status === 'ìë£' && r.completedAt) {
        const finding = findings.find((f) => f.id === r.findingId);
        eventList.push({
          date: r.completedAt,
          event: `ì­ì  ìì²­ ìë£: ${finding?.source || 'ì ì ìì'}`,
          type: 'removal',
        });
      }
    });

    // Sort by date, most recent first
    return eventList.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [findings, removalRequests]);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'finding':
        return 'border-l-4 border-danger bg-danger/10';
      case 'removal':
        return 'border-l-4 border-success bg-success/10';
      case 'report':
        return 'border-l-4 border-primary bg-primary/10';
      default:
        return 'border-l-4 border-gray-500 bg-gray-500/10';
    }
  };

  const renderChart = () => {
    const maxScore = 100;
    const chartHeight = 200;

    if (events.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 px-4 py-8 bg-dark-border/30 rounded-lg text-gray-400">
          <p>ì¤ìºì ì¤ííë©´ ë³´ì ì ì ì¶ì´ê° íìë©ëë¤.</p>
        </div>
      );
    }

    return (
      <div className="flex items-end justify-between h-64 px-4 py-8 bg-dark-border/30 rounded-lg">
        {scoreHistory.map((item, index) => {
          const barHeight = (item.score / maxScore) * chartHeight;
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div
                className="w-12 bg-gradient-primary rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{ height: `${barHeight}px` }}
              />
              <span className="text-xs text-gray-400">{item.month}</span>
              <span className="text-sm font-semibold text-white">
                {item.score}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">ìê° ë³´ì ë¦¬í¬í¸</h1>
          <p className="text-gray-400">
            {new Date().toLocaleDateString('ko-KR')} ê¸°ì¤ ë³´ì íí©
          </p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-dark-card border border-dark-border rounded-lg hover:border-primary transition-smooth">
          <Download size={20} />
          <span>ë¤ì´ë¡ë</span>
        </button>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Current Score */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 glass-morphism">
          <p className="text-gray-400 text-sm mb-2">íì¬ ì ì</p>
          <div className="flex items-end space-x-2">
            <div className="text-4xl font-bold gradient-text">
              {reportData.currentScore}
            </div>
            <div className="flex items-center space-x-1 text-danger text-sm mb-2">
              <TrendingDown size={16} />
              <span>{reportData.scoreChange} pts â</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">ì´ì  ì ëë¹</p>
        </div>

        {/* Monthly Stats */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 glass-morphism">
          <p className="text-gray-400 text-sm mb-4">ì´ë² ë¬ íµê³</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">ì¤ìº</span>
              <span className="font-semibold">{reportData.totalScans}í</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">ë°ê²¬</span>
              <span className="font-semibold text-danger">
                {reportData.findingsThisMonth}ê±´
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">ì­ì  ìë£</span>
              <span className="font-semibold text-success">
                {reportData.completedRemovals}ê±´
              </span>
            </div>
          </div>
        </div>

        {/* Removal Progress */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 glass-morphism">
          <p className="text-gray-400 text-sm mb-4">ì­ì  ìì²­ ì§íë¥ </p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>ìë£</span>
                <span className="text-success font-semibold">
                  {reportData.completedRemovals}ê±´
                </span>
              </div>
              <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-success transition-all duration-300"
                  style={{
                    width: `${(reportData.completedRemovals / reportData.removalRequestsThisMonth) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>ì§íì¤</span>
                <span className="text-warning font-semibold">
                  {reportData.removalRequestsThisMonth - reportData.completedRemovals}ê±´
                </span>
              </div>
              <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning transition-all duration-300"
                  style={{
                    width: `${((reportData.removalRequestsThisMonth - reportData.completedRemovals) / reportData.removalRequestsThisMonth) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism mb-8">
        <h2 className="text-xl font-semibold mb-6">ë³´ì ì ì ì¶ì´</h2>
        {renderChart()}
        <p className="text-xs text-gray-500 mt-4">
          â ë®ììë¡ ë ìì í©ëë¤. (0 = ë§¤ì° ìì , 100 = ë§¤ì° ìí)
        </p>
      </div>

      {/* Timeline */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism">
        <h2 className="text-xl font-semibold mb-6">íë ê¸°ë¡</h2>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${getEventColor(event.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">{event.event}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(event.date).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-black/30">
                    {event.type === 'finding'
                      ? 'ì ì¶'
                      : event.type === 'removal'
                        ? 'ì­ì '
                        : 'ë¦¬í¬í¸'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>ìì§ íë ê¸°ë¡ì´ ììµëë¤.</p>
            <p className="text-sm mt-2">ì¤ìºì ì¤ííë©´ íë ê¸°ë¡ì´ íìë©ëë¤.</p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="mt-8 bg-dark-card border border-primary/20 rounded-2xl p-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <span>â ê¶ì¥ì¬í­</span>
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start space-x-3">
            <span className="text-primary font-bold">1</span>
            <div>
              <p className="font-semibold text-white">ì ê¸°ì ì¸ ì¤ìº</p>
              <p className="text-sm text-gray-400 mt-1">
                ë§¤ì 1í ì´ì ì¤ìºì ì¤ííì¬ ìë¡ì´ ì ì¶ì ê°ì§íì¸ì.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-primary font-bold">2</span>
            <div>
              <p className="font-semibold text-white">ìë¦¼ ì¤ì </p>
              <p className="text-sm text-gray-400 mt-1">
                ìë¡ì´ ì ì¶ì´ ë°ê²¬ëë©´ ì¦ì ìë¦¼ì ë°ëë¡ ì¤ì íì¸ì.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-primary font-bold">3</span>
            <div>
              <p className="font-semibold text-white">ë¹ ë¥¸ ëì</p>
              <p className="text-sm text-gray-400 mt-1">
                ë°ê²¬ë ì ì¶ì ëí´ ì¦ì ì­ì  ìì²­ì ì§ííì¸ì.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </DashboardLayout>
  );
}
