'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import FindingCard from '@/components/FindingCard';
import { Filter } from 'lucide-react';
import type { BreachSource } from '@/lib/types';

export default function FindingsPage() {
  const { findings, updateFinding, addRemovalRequest } = useAppStore();
  const [activeTab, setActiveTab] = useState<BreachSource>('다크웹');

  const tabs: BreachSource[] = ['다크웹', '서피스웹', '데이터브로커'];

  const filteredFindings = findings.filter((f) => f.type === activeTab);

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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">유출 현황</h1>
        <p className="text-gray-400">
          발견된 모든 개인정보 유출을 확인하고 관리하세요.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-dark-border">
        <div className="flex space-x-8 overflow-x-auto pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-medium transition-smooth whitespace-nowrap ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab}
              <span className="ml-2 text-sm">
                (
                {
                  findings.filter((f) => f.type === tab).length
                }
                )
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex items-center space-x-2">
        <Filter size={20} className="text-gray-400" />
        <select className="bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-gray-300 text-sm">
          <option>모든 상태</option>
          <option>새로운</option>
          <option>진행중</option>
          <option>완료</option>
          <option>무시됨</option>
        </select>
      </div>

      {/* Findings List */}
      {filteredFindings.length > 0 ? (
        <div className="space-y-4">
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
          <p className="text-gray-400 mb-4">
            {activeTab}에서 발견된 유출이 없습니다.
          </p>
          {findings.length === 0 && (
            <p className="text-gray-500 text-sm">
              스캔을 실행하여 개인정보 유출 여부를 확인하세요.
            </p>
          )}
        </div>
      )}

      {/* Summary */}
      {filteredFindings.length > 0 && (
        <div className="mt-8 bg-dark-card border border-dark-border rounded-lg p-6 glass-morphism">
          <h3 className="font-semibold mb-4">요약</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">총 유출</p>
              <p className="text-2xl font-bold">{filteredFindings.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">높은 위험</p>
              <p className="text-2xl font-bold text-danger">
                {filteredFindings.filter((f) => f.riskLevel === '높음').length}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">중간 위험</p>
              <p className="text-2xl font-bold text-warning">
                {filteredFindings.filter((f) => f.riskLevel === '중간').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
