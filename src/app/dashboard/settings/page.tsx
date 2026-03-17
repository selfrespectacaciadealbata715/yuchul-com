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


  const handleToggleNotification = (key: string) => {
    if (user) {
      updateNotificationPreferences({
        [key]: !(user.notificationPreferences as Record<string, boolean>)[key],
      });
    }
  };
