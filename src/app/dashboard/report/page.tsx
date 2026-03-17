'use client';

export const dynamic = 'force-dynamic';

import DashboardLayout from '@/components/DashboardLayout';
import { Download, TrendingDown } from 'lucide-react';

export default function ReportPage() {
  // Mock data for the report
  const reportData = {
    currentScore: 72,
    previousScore: 45,
    scoreChange: 27,
    totalScans: 5,
    findingsThisMonth: 3,
    removalRequestsThisMonth: 2,
    completedRemovals: 1,
  };

  const scoreHistory = [
    { month: '1월', score: 85 },
    { month: '2월', score: 78 },
    { month: '3월', score: 72 },
  ];

  const events = [
    {
      date: '2024-03-17',
      event: '새로운 유출 발견: Collection #1',
      type: 'finding',
    },
    {
      date: '2024-03-10',
      event: '삭제 요청 완료: 123RF',
      type: 'removal',
    },
    {
      date: '2024-02-28',
      event: '월간 리포트 생성',
      type: 'report',
    },
    {
      date: '2024-02-15',
      event: '새로운 유출 발견: LinkedIn',
      type: 'finding',
    },
  ];

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
          <h1 className="text-3xl font-bold mb-2">월간 보안 리포트</h1>
          <p className="text-gray-400">
            {new Date().toLocaleDateString('ko-KR')} 기준 보안 현황
          </p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-dark-card border border-dark-border rounded-lg hover:border-primary transition-smooth">
          <Download size={20} />
          <span>다운로드</span>
        </button>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Current Score */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 glass-morphism">
          <p className="text-gray-400 text-sm mb-2">현재 점수</p>
          <div className="flex items-end space-x-2">
            <div className="text-4xl font-bold gradient-text">
              {reportData.currentScore}
            </div>
            <div className="flex items-center space-x-1 text-danger text-sm mb-2">
              <TrendingDown size={16} />
              <span>{reportData.scoreChange} pts ↑</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">이전 월 대비</p>
        </div>

        {/* Monthly Stats */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 glass-morphism">
          <p className="text-gray-400 text-sm mb-4">이번 달 통계</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">스캔</span>
              <span className="font-semibold">{reportData.totalScans}회</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">발견</span>
              <span className="font-semibold text-danger">
                {reportData.findingsThisMonth}건
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">삭제 완료</span>
              <span className="font-semibold text-success">
                {reportData.completedRemovals}건
              </span>
            </div>
          </div>
        </div>

        {/* Removal Progress */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 glass-morphism">
          <p className="text-gray-400 text-sm mb-4">삭제 요청 진행률</p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>완료</span>
                <span className="text-success font-semibold">
                  {reportData.completedRemovals}건
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
                <span>진행중</span>
                <span className="text-warning font-semibold">
                  {reportData.removalRequestsThisMonth - reportData.completedRemovals}건
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
        <h2 className="text-xl font-semibold mb-6">보안 점수 추이</h2>
        {renderChart()}
        <p className="text-xs text-gray-500 mt-4">
          ↓ 낮을수록 더 안전합니다. (0 = 매우 안전, 100 = 매우 위험)
        </p>
      </div>

      {/* Timeline */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism">
        <h2 className="text-xl font-semibold mb-6">활동 기록</h2>
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
                    ? '유출'
                    : event.type === 'removal'
                      ? '삭제'
                      : '리포트'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8 bg-dark-card border border-primary/20 rounded-2xl p-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <span>✓ 권장사항</span>
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start space-x-3">
            <span className="text-primary font-bold">1</span>
            <div>
              <p className="font-semibold text-white">정기적인 스캔</p>
              <p className="text-sm text-gray-400 mt-1">
                매월 1회 이상 스캔을 실행하여 새로운 유출을 감지하세요.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-primary font-bold">2</span>
            <div>
              <p className="font-semibold text-white">알림 설정</p>
              <p className="text-sm text-gray-400 mt-1">
                새로운 유출이 발견되면 즉시 알림을 받도록 설정하세요.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-primary font-bold">3</span>
            <div>
              <p className="font-semibold text-white">빠른 대응</p>
              <p className="text-sm text-gray-400 mt-1">
                발견된 유출에 대해 즉시 삭제 요청을 진행하세요.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </DashboardLayout>
  );
}
