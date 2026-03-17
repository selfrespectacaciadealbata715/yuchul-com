'use client';

import { useState, useEffect } from 'react';
import { useAppStore, hydrateStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import { Mail, Check, Send, AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react';
import { dataControllers } from '@/lib/removal-templates';
import type { Finding } from '@/lib/types';

interface RemovalTarget {
  name: string;
  email: string;
  source: string;
  finding?: Finding;
}

export default function RemovalPage() {
  const { removalRequests, findings, addRemovalRequest, updateRemovalRequest } = useAppStore();
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set());
  const [sentTargets, setSentTargets] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);

  useEffect(() => {
    hydrateStore();
  }, []);

  // Build removal targets from findings + known data controllers
  const getRemovalTargets = (): RemovalTarget[] => {
    const targets: RemovalTarget[] = [];
    const allControllers = [
      ...dataControllers.darkweb,
      ...dataControllers.databrokers,
      ...dataControllers.koreanDataBrokers,
    ];

    // Match findings to known controllers
    findings.forEach((finding) => {
      const controller = allControllers.find((c) =>
        finding.source.toLowerCase().includes(c.source.toLowerCase()) ||
        c.source.toLowerCase().includes(finding.source.toLowerCase())
      );
      if (controller) {
        targets.push({
          name: controller.name,
          email: controller.email,
          source: finding.source,
          finding,
        });
      } else {
        // For unknown sources, still allow removal
        targets.push({
          name: finding.source,
          email: '',
          source: finding.source,
          finding,
        });
      }
    });

    return targets;
  };

  const targets = getRemovalTargets();

  const toggleTarget = (source: string) => {
    setSelectedTargets((prev) => {
      const next = new Set(prev);
      if (next.has(source)) {
        next.delete(source);
      } else {
        next.add(source);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selectedTargets.size === targets.length) {
      setSelectedTargets(new Set());
    } else {
      setSelectedTargets(new Set(targets.map((t) => t.source)));
    }
  };

  const generateEmailBody = (target: RemovalTarget) => {
    const userEmail = findings[0]?.exposedData?.includes('이메일')
      ? useAppStore.getState().scanResults?.input?.email || 'user@example.com'
      : 'user@example.com';
    const date = new Date().toLocaleDateString('ko-KR');

    return `[개인정보 삭제 요청]

${target.name} 귀사

저는 귀사가 보유하고 있는 저의 개인정보에 대해 「개인정보보호법」 제35조에 따라 삭제를 요청합니다.

▶ 삭제 요청자 정보
  이메일: ${userEmail}

▶ 삭제 대상 개인정보
  ${target.finding?.exposedData?.join(', ') || '이메일, 비밀번호'}

▶ 삭제 사유
본인의 개인정보가 무단으로 수집, 저장, 유통되고 있습니다.

▶ 요청 일자
${date}

「개인정보보호법」 제35조에 따라 즉시 삭제를 요청합니다.
삭제 완료 후 서면으로 통보 부탁드립니다.

감사합니다.`;
  };

  const handleSendSelected = () => {
    setSending(true);

    const selected = targets.filter((t) => selectedTargets.has(t.source));
    selected.forEach((target) => {
      if (target.email) {
        const subject = encodeURIComponent(
          `[개인정보 삭제 요청] - ${new Date().toLocaleDateString('ko-KR')}`
        );
        const body = encodeURIComponent(generateEmailBody(target));
        const mailtoUrl = `mailto:${target.email}?subject=${subject}&body=${body}`;

        // Open mailto link
        window.open(mailtoUrl, '_blank');

        // Track as sent
        setSentTargets((prev) => new Set([...prev, target.source]));

        // Add removal request to store
        if (target.finding) {
          addRemovalRequest({
            id: 'req_' + Math.random().toString(36).substr(2, 9),
            findingId: target.finding.id,
            status: '진행중',
            createdAt: new Date().toISOString(),
            progress: 30,
            requestType: 'automatic',
            dataController: target.name,
          });
        }
      }
    });

    setTimeout(() => setSending(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '대기중': return 'bg-primary/10 text-primary';
      case '진행중': return 'bg-warning/10 text-warning';
      case '완료': return 'bg-success/10 text-success';
      case '실패': return 'bg-danger/10 text-danger';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">삭제 요청</h1>
        <p className="text-gray-400 text-sm">
          유출된 곳을 선택하면 개인정보보호법(PIPA) 기반 삭제 요청 이메일이 자동으로 생성됩니다.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">총 유출</p>
          <p className="text-xl font-bold">{findings.length}</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">선택됨</p>
          <p className="text-xl font-bold text-primary">{selectedTargets.size}</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">발송 완료</p>
          <p className="text-xl font-bold text-success">{sentTargets.size}</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">처리 중</p>
          <p className="text-xl font-bold text-warning">
            {removalRequests.filter((r) => r.status === '진행중').length}
          </p>
        </div>
      </div>

      {/* Auto Removal Section */}
      {targets.length > 0 && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Send className="text-primary" size={20} />
              <h2 className="text-lg font-semibold">자동 삭제 요청 발송</h2>
            </div>
            <button
              onClick={selectAll}
              className="text-xs text-primary hover:underline"
            >
              {selectedTargets.size === targets.length ? '전체 해제' : '전체 선택'}
            </button>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            삭제할 곳을 선택하고 &ldquo;선택 항목 삭제 요청&rdquo; 버튼을 누르면 이메일이 자동으로 구성됩니다.
          </p>

          {/* Target List */}
          <div className="space-y-2 mb-6">
            {targets.map((target) => {
              const isSent = sentTargets.has(target.source);
              const isSelected = selectedTargets.has(target.source);

              return (
                <div
                  key={target.source}
                  onClick={() => !isSent && toggleTarget(target.source)}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-smooth ${
                    isSent
                      ? 'bg-success/5 border-success/20 cursor-default'
                      : isSelected
                        ? 'bg-primary/5 border-primary/30'
                        : 'bg-dark-bg border-dark-border hover:border-primary/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-smooth ${
                      isSent
                        ? 'bg-success border-success'
                        : isSelected
                          ? 'bg-primary border-primary'
                          : 'border-gray-600'
                    }`}>
                      {(isSelected || isSent) && <Check size={12} className="text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{target.source}</p>
                      <p className="text-xs text-gray-500">
                        {target.email || '이메일 주소 미확인'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {target.finding && (
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        target.finding.riskLevel === '높음'
                          ? 'bg-danger/20 text-danger'
                          : target.finding.riskLevel === '중간'
                            ? 'bg-warning/20 text-warning'
                            : 'bg-success/20 text-success'
                      }`}>
                        {target.finding.riskLevel}
                      </span>
                    )}
                    {isSent && (
                      <span className="text-xs text-success flex items-center space-x-1">
                        <CheckCircle size={14} />
                        <span>발송됨</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendSelected}
            disabled={selectedTargets.size === 0 || sending}
            className="w-full px-6 py-3 bg-gradient-primary text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-40 transition-smooth flex items-center justify-center space-x-2"
          >
            <Mail size={18} />
            <span>
              {sending
                ? '발송 중...'
                : selectedTargets.size > 0
                  ? `${selectedTargets.size}건 삭제 요청 발송`
                  : '삭제할 곳을 선택하세요'}
            </span>
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            이메일 클라이언트가 열리며 사전 작성된 PIPA 삭제 요청이 자동으로 구성됩니다.
          </p>
        </div>
      )}

      {/* No findings */}
      {targets.length === 0 && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center mb-8">
          <CheckCircle size={48} className="text-success mx-auto mb-4" />
          <p className="text-gray-400 mb-2">삭제 요청할 유출 항목이 없습니다.</p>
          <p className="text-sm text-gray-500">스캔을 먼저 실행해주세요.</p>
        </div>
      )}

      {/* Existing Removal Requests */}
      {removalRequests.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">요청 이력</h2>
          <div className="space-y-3">
            {removalRequests.map((request) => {
              const finding = findings.find((f) => f.id === request.findingId);
              return (
                <div
                  key={request.id}
                  className="bg-dark-card border border-dark-border rounded-xl p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-white text-sm">
                        {request.dataController || finding?.source || '삭제 요청'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString('ko-KR')} 요청
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-dark-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all"
                      style={{ width: `${request.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}