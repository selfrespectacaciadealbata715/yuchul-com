'use client';

import { AlertCircle, CheckCircle, Trash2, Archive } from 'lucide-react';
import type { Finding, RiskLevel } from '@/lib/types';

interface FindingCardProps {
  finding: Finding;
  onRemove?: (findingId: string) => void;
  onIgnore?: (findingId: string) => void;
}

export default function FindingCard({
  finding,
  onRemove,
  onIgnore,
}: FindingCardProps) {
  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case '높음':
        return 'bg-red-500/10 border-danger text-danger';
      case '중간':
        return 'bg-yellow-500/10 border-warning text-warning';
      case '낮음':
        return 'bg-green-500/10 border-success text-success';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case '높음':
        return <AlertCircle size={16} />;
      case '중간':
        return <AlertCircle size={16} />;
      case '낮음':
        return <CheckCircle size={16} />;
    }
  };

  const getStatusBadge = () => {
    switch (finding.status) {
      case 'new':
        return <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">새로운</span>;
      case 'in-progress':
        return (
          <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded">
            진행중
          </span>
        );
      case 'removed':
        return (
          <span className="text-xs bg-success/20 text-success px-2 py-1 rounded">
            삭제됨
          </span>
        );
      case 'ignored':
        return (
          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">
            무시됨
          </span>
        );
    }
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-4 hover:border-primary/50 transition-smooth">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1">{finding.source}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>
              {finding.type} • {new Date(finding.dateFound).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>
        <div className={`flex items-center space-x-2 px-2 py-1 rounded border ${getRiskLevelColor(finding.riskLevel)}`}>
          {getRiskIcon(finding.riskLevel)}
          <span className="text-sm font-medium">{finding.riskLevel}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-3">{finding.description}</p>

      {/* Exposed Data Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {finding.exposedData.map((data) => (
          <span
            key={data}
            className="text-xs bg-dark-border text-gray-300 px-2 py-1 rounded"
          >
            {data}
          </span>
        ))}
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        {getStatusBadge()}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {finding.status !== 'removed' && finding.status !== 'ignored' && (
          <>
            <button
              onClick={() => onRemove?.(finding.id)}
              className="flex items-center space-x-1 text-sm px-3 py-1 rounded bg-danger/10 text-danger hover:bg-danger/20 transition-smooth"
            >
              <Trash2 size={16} />
              <span>삭제 요청</span>
            </button>
            <button
              onClick={() => onIgnore?.(finding.id)}
              className="flex items-center space-x-1 text-sm px-3 py-1 rounded bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 transition-smooth"
            >
              <Archive size={16} />
              <span>무시</span>
            </button>
          </>
        )}
        {finding.status === 'removed' && (
          <div className="flex items-center space-x-1 text-sm text-success">
            <CheckCircle size={16} />
            <span>삭제됨</span>
          </div>
        )}
      </div>
    </div>
  );
}
