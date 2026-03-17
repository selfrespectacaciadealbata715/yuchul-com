'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import { Plus, Trash2 } from 'lucide-react';
import type { Identifier } from '@/lib/types';

export default function SettingsPage() {
  const { user, addIdentifier, removeIdentifier, updateNotificationPreferences } =
    useAppStore();
  const [newIdentifier, setNewIdentifier] = useState({
    type: 'email' as Identifier['type'],
    value: '',
  });

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

  const handleToggleNotification = (key: keyof typeof user!.notificationPreferences) => {
    if (user) {
      updateNotificationPreferences({
        [key]: !user.notificationPreferences[key],
      });
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">설정</h1>
        <p className="text-gray-400">
          계정 설정 및 알림 환경설정을 관리하세요.
        </p>
      </div>

      {/* Notification Settings */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 mb-8 glass-morphism">
        <h2 className="text-2xl font-semibold mb-6">알림 설정</h2>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 bg-dark-border/50 rounded-lg">
            <div>
              <p className="font-semibold text-white mb-1">이메일 알림</p>
              <p className="text-sm text-gray-400">
                새로운 유출 및 활동에 대한 이메일을 받습니다.
              </p>
            </div>
            <button
              onClick={() => handleToggleNotification('emailNotifications')}
              className={`w-12 h-7 rounded-full transition-colors ${
                user?.notificationPreferences.emailNotifications
                  ? 'bg-success'
                  : 'bg-dark-border'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  user?.notificationPreferences.emailNotifications
                    ? 'translate-x-5'
                    : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Web Notifications */}
          <div className="flex items-center justify-between p-4 bg-dark-border/50 rounded-lg">
            <div>
              <p className="font-semibold text-white mb-1">웹 알림</p>
              <p className="text-sm text-gray-400">
                브라우저 알림을 받습니다.
              </p>
            </div>
            <button
              onClick={() => handleToggleNotification('webNotifications')}
              className={`w-12 h-7 rounded-full transition-colors ${
                user?.notificationPreferences.webNotifications
                  ? 'bg-success'
                  : 'bg-dark-border'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  user?.notificationPreferences.webNotifications
                    ? 'translate-x-5'
                    : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* New Breach Alert */}
          <div className="flex items-center justify-between p-4 bg-dark-border/50 rounded-lg">
            <div>
              <p className="font-semibold text-white mb-1">새로운 유출 알림</p>
              <p className="text-sm text-gray-400">
                새로운 개인정보 유출이 발견되면 즉시 알립니다.
              </p>
            </div>
            <button
              onClick={() => handleToggleNotification('newBreachAlert')}
              className={`w-12 h-7 rounded-full transition-colors ${
                user?.notificationPreferences.newBreachAlert
                  ? 'bg-success'
                  : 'bg-dark-border'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  user?.notificationPreferences.newBreachAlert
                    ? 'translate-x-5'
                    : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Removal Status */}
          <div className="flex items-center justify-between p-4 bg-dark-border/50 rounded-lg">
            <div>
              <p className="font-semibold text-white mb-1">삭제 상태 알림</p>
              <p className="text-sm text-gray-400">
                삭제 요청의 상태가 변경되면 알립니다.
              </p>
            </div>
            <button
              onClick={() => handleToggleNotification('removalStatus')}
              className={`w-12 h-7 rounded-full transition-colors ${
                user?.notificationPreferences.removalStatus
                  ? 'bg-success'
                  : 'bg-dark-border'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  user?.notificationPreferences.removalStatus
                    ? 'translate-x-5'
                    : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Weekly Report */}
          <div className="flex items-center justify-between p-4 bg-dark-border/50 rounded-lg">
            <div>
              <p className="font-semibold text-white mb-1">주간 리포트</p>
              <p className="text-sm text-gray-400">
                매주 금요일 보안 리포트를 받습니다.
              </p>
            </div>
            <button
              onClick={() => handleToggleNotification('weeklyReport')}
              className={`w-12 h-7 rounded-full transition-colors ${
                user?.notificationPreferences.weeklyReport
                  ? 'bg-success'
                  : 'bg-dark-border'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  user?.notificationPreferences.weeklyReport
                    ? 'translate-x-5'
                    : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
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
