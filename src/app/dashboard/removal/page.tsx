'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import DashboardLayout from 'A/components/DashboardLayout';
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
        });
        navigator.clipboard.writeText(template.body);
        setCopiedId(requestId);
        setTimeout(() => setCopiedId(null), 2000);
      }
    }
  };

  const handleSendRequest = async (requestId: string) => {
    setSendingId(requestId);
    setSendProgress(0);
    const totalSteps = 70;
    for (let i = 0; i <= totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setSendProgress(Math.floor((i / totalSteps) * 100));
    }
  
  
  etSendingId(null);
    setSendProgress(0);
    alert('done');
  };
}
