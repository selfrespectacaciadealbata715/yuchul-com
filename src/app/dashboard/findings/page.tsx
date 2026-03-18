'use client';

import { useState, useEffect } from 'react';
import { useAppStore, hydrateStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import FindingCard from '@/components/FindingCard';
import type { BreachSource } from '@/lib/types';

export default function FindingsPage() {
  const { findings, updateFinding, addRemovalRequest } = useAppStore();
  const [activeTab, setActiveTab] = useState<'전체' | BreachSource>('전체');

  useEffect(() => {
    hydrateStore();
  }, []);

  const tabs: ('전체' | BreachSource)[] = ['전체', '다크웹', '서피스웹', '데이터브로커'];

  const filteredFindings = activeTab === '전체'
    ? findings
    : findings.filter((f) => f.type === activeTab);

  const handleRemove = (findingId: string) => {
    addRemovalRequest({
      id: 'req_' + Math.random().toString(36).substr(2, 9),
      findingId,
      status: '대기중',
      createdAt: new Date().toISOString(),
      progress: 0,
      requestType: 'automatic',
    });
    updateFinding(findingId, { status: 'in-progress' });
  };

  const handleIgnore = (findingId: string) => {
    updateFinding(findingId, { status: 'ignored' });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">유출 현황</h1>
        <p className="text-gray-400 text-sm">
          발견된 모든 개인정보 유출을 확인하고 관리하세요.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex space-x-2 overflow-x-auto">
        {tabs.map((tab) => {
          const count = tab === '전체'
            ? findings.length
            : findings.filter((f) => f.type === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={"px-4 py-2 rounded-lg text-sm font-medium transition-smooth whitespace-nowrap " + (
                activeTab === tab
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              )}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {filteredFindings.length > 0 ? (
        <div className="space-y-3">
          {filteredFindings.map((finding) => (
            <FindingCard
              key={finding.id}
              finding={finding}
              onRemove={handleRemove}
              onIgnore={handleIgnore}
            />
          ))}
        </div>
      ) : (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-sm">
            {findings.length === 0
              ? '스캔을 실행하여 유출 여부를 확인하세요.'
              : `${activeTab}에서 발견된 유출이 없습니다.`}
          </p>
        </div>
      )}

      {filteredFindings.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">총 유출</p>
            <p className="text-xl font-bold">{filteredFindings.length}</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">높음</p>
            <p className="text-xl font-bold text-danger">
              {filteredFindings.filter((f) => f.riskLevel === '높음').length}
            </p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">중간</p>
            <p className="text-xl font-bold text-warning">
              {filteredFindings.filter((f) => f.riskLevel === '중간').length}
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}