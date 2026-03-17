'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import { Plus, Trash2 } from 'lucide-react';
import type { Identifier } from '@/lib/types';

export default function SettingsPage() {
  const { user, addIdentifier, removeIdentifier } =
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

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ì¤ì </h1>
      </div>

      {/* Managed Identifiers */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism">
        <h2 className="text-2xl font-semibold mb-6">ê´ë¦¬ ì¤ì¸ ì ë³´</h2>

        {/* Add New Identifier */}
        <div className="mb-8 p-6 bg-dark-border/50 rounded-lg">
          <p className="text-sm text-gray-400 mb-4">
            ì¤ìºí  ì´ë©ì¼, ì íë²í¸, ì¬ì©ìëª ë±ì ì¶ê°íì¸ì.
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
              <option value="email">ì´ë©ì¼</option>
              <option value="phone">ì íë²í¸</option>
              <option value="username">ì¬ì©ìëª</option>
              <option value="name">ì´ë¦</option>
            </select>
            <input
              type="text"
              value={newIdentifier.value}
              onChange={(e) =>
                setNewIdentifier({ ...newIdentifier, value: e.target.value })
              }
              placeholder="ê°ì ìë ¥íì¸ì..."
              className="flex-1 px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-gray-300"
            />
            <button
              onClick={handleAddIdentifier}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-smooth font-medium"
            >
              <Plus size={20} />
              <span>ì¶ê°</span>
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
                      ? 'ì´ë©ì¼'
                      : identifier.type === 'phone'
                        ? 'ì íë²í¸'
                        : identifier.type === 'username'
                          ? 'ì¬ì©ìëª'
                          : 'ì´ë¦'}
                  </p>
                  <p className="text-gray-400 text-sm">{identifier.value}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ì¶ê°ë¨: {new Date(identifier.addedAt).toLocaleDateString('ko-KR')}
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
            <p className="text-gray-400">ì¶ê°ë ì ë³´ê° ììµëë¤.</p>
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="mt-8 bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism">
        <h2 className="text-2xl font-semibold mb-6">ê³ì  ì¤ì </h2>

        <div className="space-y-4">
          <div className="p-4 bg-dark-border/50 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">ê³ì  ID</p>
            <p className="font-mono text-gray-300">{user?.id}</p>
          </div>

          <div className="p-4 bg-dark-border/50 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">ê³ì  ìì±ì¼</p>
            <p className="text-gray-300">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('ko-KR')
                : '-'}
            </p>
          </div>

          <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg mt-6">
            <p className="font-semibold text-white mb-2">ìí ìì­</p>
            <button className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-smooth text-sm font-medium">
              ê³ì  ì­ì 
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
