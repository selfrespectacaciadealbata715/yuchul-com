'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import { Mail, Copy, Check } from 'lucide-react';
import { generateRemovalRequestEmail, dataControllers } from '@/lib/removal-templates';

export default function RemovalPage() {
  const { removalRequests, findings } = useAppStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyEmail = (requestId: string) => {
    const request = removalRequests.find((r) => r.id === requestId);
    if (request) {
      const finding = findings.find((f) => f.id === request.findingId);
      if (finding) {
        const template = generateRemovalRequestEmail(finding.source, {
          name: 'ì´ë¦',
          email: 'example@gmail.com',
        }, finding.exposedData);

        navigator.clipboard.writeText(template.body);
        setCopiedId(requestId);
        setTimeout(() => setCopiedId(null), 2000);
      }
    }
  };

  const getContactEmailForSource = (source: string): string | null => {
    const allControllers = [
      ...dataControllers.darkweb,
      ...dataControllers.databrokers,
      ...dataControllers.koreanDataBrokers,
    ];
    const controller = allControllers.find((c) => c.source === source);
    return controller?.email || null;
  };

  const generateMailtoLink = (requestId: string): string | null => {
    const request = removalRequests.find((r) => r.id === requestId);
    if (!request) return null;

    const finding = findings.find((f) => f.id === request.findingId);
    if (!finding) return null;

    const contactEmail = getContactEmailForSource(finding.source);
    if (!contactEmail) return null;

    const template = generateRemovalRequestEmail(finding.source, {
      name: 'ì´ë¦',
      email: 'example@gmail.com',
    }, finding.exposedData);

    const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;
    return mailtoUrl;
  };

  const getStatusColor = (
    status: 'ëê¸°ì¤' | 'ì§íì¤' | 'ìë£' | 'ì¤í¨'
  ) => {
    switch (status) {
      case 'ëê¸°ì¤':
        return 'bg-primary/10 text-primary';
      case 'ì§íì¤':
        return 'bg-warning/10 text-warning';
      case 'ìë£':
        return 'bg-success/10 text-success';
      case 'ì¤í¨':
        return 'bg-danger/10 text-danger';
    }
  };

  const getPIPA = () => `[ê°ì¸ì ë³´ ì­ì  ìì²­]

í´ë¹ íì¬ëª ê·ì¬

ì ë ê·ì¬ê° ë³´ì íê³  ìë ì ì ê°ì¸ì ë³´ì ëí´ ãê°ì¸ì ë³´ë³´í¸ë²ã ì 35ì¡°(ê°ì¸ì ë³´ì ì´ë)ì ë°ë¼ ì­ì ë¥¼ ìì²­í©ëë¤.

â¶ ì­ì  ìì²­ì ì ë³´
  ì±ëª: [ì´ë¦]
  ì´ë©ì¼: [ì´ë©ì¼]
  ì í: [ì íë²í¸]

â¶ ì­ì  ëì ê°ì¸ì ë³´
  - ì´ë©ì¼
  - ì´ë¦
  - ì íë²í¸

â¶ ì­ì  ì¬ì 
ë³¸ì¸ì ê°ì¸ì ë³´ê° ë¬´ë¨ì¼ë¡ ìì§, ì ì¥, ì íµëê³  ìì¼ë©°, ì´ë ãê°ì¸ì ë³´ë³´í¸ë²ã ì 15ì¡°(ê°ì¸ì ë³´ ìì§ì ì í)ë¥¼ ìë°í©ëë¤.

â¶ ìì²­ ì¼ì
${new Date().toLocaleDateString('ko-KR')}

ãê°ì¸ì ë³´ë³´í¸ë²ã ì 35ì¡°ì ë°ë¼ ë¤ìê³¼ ê°ì´ ìì²­í©ëë¤:
1. ê·ì¬ê° ë³´ì íê³  ìë ë³¸ì¸ì ê°ì¸ì ë³´ë¥¼ íì¸í´ì£¼ìê¸° ë°ëëë¤.
2. ì ê°ì¸ì ë³´ë¥¼ ì¦ì ì­ì í´ì£¼ìê¸° ë°ëëë¤.
3. ì­ì  ìë£ í ìë©´ì¼ë¡ ìë£ ì¬í­ì íµë³´í´ì£¼ìê¸° ë°ëëë¤.

ë³¸ ìì²­ì ëí íì ì [ì´ë©ì¼]ë¡ ë¶íëë¦½ëë¤.

ê°ì¬í©ëë¤.`;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ì­ì  ìì²­ ê´ë¦¬</h1>
        <p className="text-gray-400">
          ê°ì¸ì ë³´ë³´í¸ë²(PIPA) ê¸°ë°ì ìëíë ì­ì  ìì²­ì ê´ë¦¬íì¸ì.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Ü ìì²­</p>
          <p className="text-2xl font-bold">{removalRequests.length}</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">ëê¸°ì¤</p>
          <p className="text-2xl font-bold text-primary">
            {removalRequests.filter((r) => r.status === 'ëê¸°ì¤').length}
          </p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">ì§íì¤</p>
          <p className="text-2xl font-bold text-warning">
            {removalRequests.filter((r) => r.status === 'ì§íì¤').length}
          </p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">ìë£</p>
          <p className="text-2xl font-bold text-success">
            {removalRequests.filter((r) => r.status === 'ìë£').length}
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
                      {finding?.source || 'ì ì ìë ì¶ì²'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {new Date(request.createdAt).toLocaleDateString('ko-KR')}{' '}
                      ìì²­ë¨
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
                    <span>ì§íë¥ </span>
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
                        <span>ë³µì¬ë¨</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>ííë¦¿ ë³µì¬</span>
                      </>
                    )}
                  </button>
                  {generateMailtoLink(request.id) ? (
                    <a
                      href={generateMailtoLink(request.id) || ''}
                      className="flex items-center space-x-2 text-sm px-3 py-2 rounded bg-gradient-primary text-white hover:opacity-90 transition-smooth"
                    >
                      <Mail size={16} />
                      <span>ì­ì  ìì²­ ë°ì¡</span>
                    </a>
                  ) : (
                    <div className="flex items-center space-x-2 text-sm px-3 py-2 rounded bg-gray-500/20 text-gray-400">
                      <Mail size={16} />
                      <span>ì´ë©ì¼ ì£¼ì ìì</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center mb-8">
          <p className="text-gray-400">ìì§ ì­ì  ìì²­ì´ ììµëë¤.</p>
        </div>
      )}

      {/* PIPA Template */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism">
        <h2 className="text-2xl font-semibold mb-6">
          PIPA ì­ì  ìì²­ ííë¦¿
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          ë¤ì ííë¦¿ì ì¬ì©íì¬ ê°ì¸ì ë³´ ì­ì ë¥¼ ìì²­í  ì ììµëë¤.
          ì ë³´ë¥¼ ìë ¥íê³  í´ë¹ íì¬ì ì´ë©ì¼ë¡ ë°ì¡íì¸ì.
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
            alert('ííë¦¿ì´ ë³µì¬ëììµëë¤.');
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-smooth"
        >
          <Copy size={18} />
          <span>ííë¦¿ ë³µì¬</span>
        </button>

        {/* Info */}
        <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-gray-300">
            <strong>ì£¼ì:</strong> ííë¦¿ì [ì ë³´]ë ìì ì ì¤ì  ì ë³´ë¡ ëì²´íì¸ì.
            ëª¨ë  í­ëª©ì íììëë¤. ë²ë¥  ìë¬¸ì´ íìí ê²½ì° ë³í¸ì¬ì ìë´íì¸ì.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
