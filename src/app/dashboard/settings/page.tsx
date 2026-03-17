'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import { Plus, Trash2, Key, Eye, EyeOff, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import type { Identifier } from '@/lib/types';
import { PROVIDERS, getApiKey, setApiKey, removeApiKey, getActiveProviders } from '@/lib/api-keys';
import type { ProviderId } from '@/lib/api-keys';

export default function SettingsPage() {
  const { user, addIdentifier, removeIdentifier } =
    useAppStore();
  const [newIdentifier, setNewIdentifier] = useState({
    type: 'email' as Identifier['type'],
    value: '',
  });

  // API Key management state
  const [apiKeys, setApiKeys] = useState<Partial<Record<ProviderId, string>>>({});
  const [editingProvider, setEditingProvider] = useState<ProviderId | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | 'testing' | null>>({});

  useEffect(() => {
    // Load API keys from localStorage on mount
    const loadedKeys: Partial<Record<ProviderId, string>> = {};
    PROVIDERS.forEach((p) => {
      const key = getApiKey(p.id);
      if (key) loadedKeys[p.id] = key;
    });
    setApiKeys(loadedKeys);
  }, []);

  const handleSaveKey = (providerId: ProviderId) => {
    if (editValue.trim()) {
      setApiKey(providerId, editValue.trim());
      setApiKeys((prev) => ({ ...prev, [providerId]: editValue.trim() }));
    } else {
      removeApiKey(providerId);
      setApiKeys((prev) => {
        const next = { ...prev };
        delete next[providerId];
        return next;
      });
    }
    setEditingProvider(null);
    setEditValue('');
  };

  const handleRemoveKey = (providerId: ProviderId) => {
    removeApiKey(providerId);
    setApiKeys((prev) => {
      const next = { ...prev };
      delete next[providerId];
      return next;
    });
    setTestResults((prev) => ({ ...prev, [providerId]: null }));
  };

  const handleTestKey = async (providerId: ProviderId) => {
    const key = apiKeys[providerId];
    if (!key) return;

    setTestResults((prev) => ({ ...prev, [providerId]: 'testing' }));

    try {
      const res = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerId,
          apiKey: key,
          email: 'test@example.com',
        }),
      });

      if (res.ok || res.status === 404) {
        setTestResults((prev) => ({ ...prev, [providerId]: 'success' }));
      } else {
        setTestResults((prev) => ({ ...prev, [providerId]: 'error' }));
      }
    } catch {
      setTestResults((prev) => ({ ...prev, [providerId]: 'error' }));
    }
  };

  const toggleShowKey = (providerId: string) => {
    setShowKeys((prev) => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return '••••••••';
    return key.substring(0, 4) + '••••••••' + key.substring(key.length - 4);
  };

  const handleAddIdentifier = () => {
    if (newIdentifier.value.trim()) {
      addIdentifier({
        id: 'id_' + Math.random().toString(36).substr(2, 9),
        type: newIdentifier.type,
        value: newIdentifier.value,
        addedAt: new Date().toISOString(),
        scanCount: 0,
      });
      setNewIdentifier({ type: 'email', value: '' });
    }
  };

  const activeCount = Object.keys(apiKeys).length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">설정</h1>
      </div>

      {/* API Key Management */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Key size={24} className="text-primary" />
            <h2 className="text-2xl font-semibold">유료 API 프로바이더</h2>
          </div>
          <span className="text-sm text-gray-400">
            {activeCount}개 활성화됨
          </span>
        </div>

        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-gray-300">
            유료 API 키를 등록하면 더 정확하고 상세한 유출 정보를 확인할 수 있습니다.
            API 키는 브라우저에만 저장되며, 서버에 절대 저장되지 않습니다.
          </p>
        </div>

        <div className="space-y-4">
          {PROVIDERS.map((provider) => {
            const hasKey = !!apiKeys[provider.id];
            const isEditing = editingProvider === provider.id;
            const testResult = testResults[provider.id];

            return (
              <div
                key={provider.id}
                className={`p-5 rounded-lg border transition-colors ${
                  hasKey
                    ? 'bg-dark-border/50 border-primary/30'
                    : 'bg-dark-border/30 border-dark-border'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white">{provider.name}</h3>
                      {hasKey && (
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                          활성
                        </span>
                      )}
                      {testResult === 'success' && (
                        <CheckCircle size={16} className="text-green-400" />
                      )}
                      {testResult === 'error' && (
                        <XCircle size={16} className="text-danger" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{provider.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">{provider.pricingInfo}</span>
                      <a
                        href={provider.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center space-x-1"
                      >
                        <span>API 키 발급</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {provider.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-0.5 bg-dark-border text-gray-400 text-xs rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Input / Display */}
                {isEditing ? (
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder={provider.apiKeyPlaceholder}
                      className="flex-1 px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-gray-300 text-sm font-mono"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveKey(provider.id)}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-smooth"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => {
                        setEditingProvider(null);
                        setEditValue('');
                      }}
                      className="px-4 py-2 bg-dark-border text-gray-300 rounded-lg text-sm hover:bg-dark-border/80 transition-smooth"
                    >
                      취소
                    </button>
                  </div>
                ) : hasKey ? (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-sm font-mono text-gray-400">
                      {showKeys[provider.id]
                        ? apiKeys[provider.id]
                        : maskKey(apiKeys[provider.id] || '')}
                    </div>
                    <button
                      onClick={() => toggleShowKey(provider.id)}
                      className="p-2 text-gray-400 hover:text-gray-300 transition-smooth"
                      title={showKeys[provider.id] ? '숨기기' : '보기'}
                    >
                      {showKeys[provider.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => handleTestKey(provider.id)}
                      disabled={testResult === 'testing'}
                      className="px-3 py-2 bg-dark-border text-gray-300 rounded-lg text-sm hover:bg-dark-border/80 transition-smooth disabled:opacity-50"
                    >
                      {testResult === 'testing' ? '테스트 중...' : '테스트'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingProvider(provider.id);
                        setEditValue(apiKeys[provider.id] || '');
                      }}
                      className="px-3 py-2 bg-dark-border text-gray-300 rounded-lg text-sm hover:bg-dark-border/80 transition-smooth"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleRemoveKey(provider.id)}
                      className="p-2 text-gray-400 hover:text-danger transition-smooth"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingProvider(provider.id);
                      setEditValue('');
                    }}
                    className="mt-3 px-4 py-2 border border-dashed border-dark-border text-gray-400 rounded-lg text-sm hover:border-primary hover:text-primary transition-smooth w-full"
                  >
                    + API 키 추가
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Managed Identifiers */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism">
        <h2 className="text-2xl font-semibold mb-6">관리 중인 정보</h2>

        {/* Add New Identifier */}
        <div className="mb-8 p-6 bg-dark-border/50 rounded-lg">
          <p className="text-sm text-gray-400 mb-4">
            스캔할 이메일, 전화번호, 사용자명 등을 추가하세요.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={newIdentifier.type}
              onChange={(e) =>
                setNewIdentifier({
                  ...newIdentifier,
                  type: e.target.value as Identifier['type'],
                })
              }
              className="px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-gray-300 md:w-32"
            >
              <option value="email">이메일</option>
              <option value="phone">전화번호</option>
              <option value="username">사용자명</option>
              <option value="name">이름</option>
            </select>
            <input
              type="text"
              value={newIdentifier.value}
              onChange={(e) =>
                setNewIdentifier({ ...newIdentifier, value: e.target.value })
              }
              placeholder="값을 입력하세요..."
              className="flex-1 px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-gray-300"
            />
            <button
              onClick={handleAddIdentifier}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-smooth font-medium"
            >
              <Plus size={20} />
              <span>추가</span>
            </button>
          </div>
        </div>

        {/* Identifiers List */}
        {user && user.identifiers.length > 0 ? (
          <div className="space-y-3">
            {user.identifiers.map((identifier) => (
              <div
                key={identifier.id}
                className="flex items-center justify-between p-4 bg-dark-border/50 rounded-lg hover:bg-dark-border transition-colors"
              >
                <div>
                  <p className="font-semibold text-white text-sm">
                    {identifier.type === 'email'
                      ? '이메일'
                      : identifier.type === 'phone'
                        ? '전화번호'
                        : identifier.type === 'username'
                          ? '사용자명'
                          : '이름'}
                  </p>
                  <p className="text-gray-400 text-sm">{identifier.value}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    추가됨: {new Date(identifier.addedAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <button
                  onClick={() => removeIdentifier(identifier.id)}
                  className="p-2 text-gray-400 hover:text-danger transition-smooth hover:bg-danger/10 rounded-lg"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-dark-border/30 rounded-lg">
            <p className="text-gray-400">추가된 정보가 없습니다.</p>
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="mt-8 bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism">
        <h2 className="text-2xl font-semibold mb-6">계정 설정</h2>

        <div className="space-y-4">
          <div className="p-4 bg-dark-border/50 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">계정 ID</p>
            <p className="font-mono text-gray-300">{user?.id}</p>
          </div>

          <div className="p-4 bg-dark-border/50 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">계정 생성일</p>
            <p className="text-gray-300">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('ko-KR')
                : '-'}
            </p>
          </div>

          <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg mt-6">
            <p className="font-semibold text-white mb-2">위험 영역</p>
            <button className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-smooth text-sm font-medium">
              계정 삭제
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
