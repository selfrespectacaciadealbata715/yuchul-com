'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import LoadingWithAd from '@/components/LoadingWithAd';
import { Mail, Copy, Check, Send } from 'lucide-react';
import { generateRemovalRequestEmail } from '@/lib/removal-templates';

export default function RemovalPage() {
  const { removalRequests, findings } = useAppStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sendProgress, setSendProgress] = useState(0);

  const handleCopyEmail = (requestId: string) => {
    const request = removalRequests.find((r) => r.id === requestId);
    if (request) {
      const finding = findings.find((f) => f.id === request.findingId);
      if (finding) {
        const template = generateRemovalRequestEmail(finding.source, {
          name: '이름',
          email: 'example@gmail.com',
        }, finding.exposedData);

        navigator.clipboard.writeText(template.body);
        setCopiedId(requestId);
        setTimeout(() => setCopiedId(null), 2000);
      }
    }
  };

  const handleSendRequest = async (requestId: string) => {
    setSendingId(requestId);
    setSendProgress(0);

    // Intentionally longer loading (7 seconds) for ad display
    const totalSteps = 70;
    for (let i = 0; i <= totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setSendProgress(Math.floor((i / totalSteps) * 100));
    }

    setSendingId(null);
    setSendProgress(0);
    alert('삭제 요청이 발송되었습니다. 결과는 이메일로 안내됩니다.');
  };

  const getStatusColor = (
    status: '대기중' | '진행중' | '완료' | '실패'
  ) => {
    switch (status) {
      case '대기중':
        return 'bg-primary/10 text-primary';
      case '진행중':
        return 'bg-warning/10 text-warning';
      case '완료':
        return 'bg-success/10 text-success';
      case '실패':
        return 'bg-danger/10 text-danger';
    }
  };

  const getPIPA = () => `[개인정보 삭제 요청]

해당 회사명 귀사

저는 귀사가 보유하고 있는 저의 개인정보에 대해 「개인정보보호법」 제35조(개인정보의 열람)에 따라 삭제를 요청합니다.

▶ 삭제 요청자 정보
  성명: [이름]
  이메일: [이메일]
  전화: [전화번호]

▶ 삭제 대상 개인정보
  - 이메일
  - 이름
  - 전화번호

▶ 삭제 사유
본인의 개인정보가 무단으로 수집, 저장, 유통되고 있으며, 이는 「개인정보보호법」 제15조(개인정보 수집의 제한)를 위반합니다.

▶ 요청 일자
${new Date().toLocaleDateString('ko-KR')}

「개인정보보호법」 제35조에 따라 다음과 같이 요청합니다:
1. 귀사가 보유하고 있는 본인의 개인정보를 확인해주시기 바랍니다.
2. 위 개인정보를 즉시 삭제해주시기 바랍니다.
3. 삭제 완료 후 서면으로 완료 사항을 통보해주시기 바랍니다.

본 요청에 대한 회신은 [이메일]로 부탁드립니다.

감사합니다.`;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">삭제 요청 관리</h1>
        <p className="text-gray-400">
          개인정보보호법(PIPA) 기반의 자동화된 삭제 요청을 관리하세요.
        </p>
      </div>

      {/* Removal Request Loading with Ads */}
      {sendingId && (
        <LoadingWithAd progress={sendProgress} type="removal" />
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">총 요청</p>
          <p className="text-2xl font-bold">{removalRequests.length}</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">대기중</p>
          <p className="text-2xl font-bold text-primary">
            {removalRequests.filter((r) => r.status === '대기중').length}
          </p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">진행중</p>
          <p className="text-2xl font-bold text-warning">
            {removalRequests.filter((r) => r.status === '진행중').length}
          </p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">완료</p>
          <p className="text-2xl font-bold text-success">
            {removalRequests.filter((r) => r.status === '완료').length}
          </p>
        </div>
      </div>

      {/* Removal Requests List */}
      {removalRequests.length > 0 ? (
        <div className="space-y-4 mb-8">
          {removalRequests.map((request) => {
            const finding = findings.find((f) => f.id === request.findingId);
            return (
              <div
                key={request.id}
                className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-primary/50 transition-smooth"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {finding?.source || '알 수 없는 출처'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {new Date(request.createdAt).toLocaleDateString('ko-KR')}{' '}
                      요청됨
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}
                  >
                    {request.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>진행률</span>
                    <span>{request.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all duration-300"
                      style={{ width: `${request.progress}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyEmail(request.id)}
                    className="flex items-center space-x-2 text-sm px-3 py-2 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-smooth"
                  >
                    {copiedId === request.id ? (
                      <>
                        <Check size={16} />
                        <span>복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>템플릿 복사</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleSendRequest(request.id)}
                    disabled={sendingId !== null}
                    className="flex items-center space-x-2 text-sm px-3 py-2 rounded bg-gradient-primary text-white hover:opacity-90 disabled:opacity-50 transition-smooth"
                  >
                    <Send size={16} />
                    <span>삭제 요청 발송</span>
                  </button>
                  <a
                    href="#contact"
                    className="flex items-center space-x-2 text-sm px-3 py-2 rounded bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 transition-smooth"
                  >
                    <Mail size={16} />
                    <span>이메일</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center mb-8">
          <p className="text-gray-400">아직 삭제 요청이 없습니다.</p>
        </div>
      )}

      {/* PIPA Template */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism">
        <h2 className="text-2xl font-semibold mb-6">
          PIPA 삭제 요청 템플릿
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          다음 템플릿을 사용하여 개인정보 삭제를 요청할 수 있습니다.
          정보를 입력하고 해당 회사에 이메일로 발송하세요.
        </p>

        {/* Template Box */}
        <div className="bg-dark-border rounded-lg p-6 mb-4 max-h-96 overflow-y-auto">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
            {getPIPA()}
          </pre>
        </div>

        {/* Copy Button */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(getPIPA());
            alert('템플릿이 복사되었습니다.');
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-smooth"
        >
          <Copy size={18} />
          <span>템플릿 복사</span>
        </button>

        {/* Info */}
        <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-gray-300">
            <strong>주의:</strong> 템플릿의 [정보]는 자신의 실제 정보로 대체하세요.
            모든 항목은 필수입니다. 법률 자문이 필요한 경우 변호사와 상담하세요.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
