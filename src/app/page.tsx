'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import ScanForm from '@/components/ScanForm';
import { Shield, Search, Bell, Zap, CheckCircle, ArrowRight, Lock, Globe, AlertTriangle } from 'lucide-react';
import type { ScanInput } from 'A/lib/types';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { setPendingScanInput } = useAppStore();

  const handleScan = async (data: ScanInput) => {
    setPendingScanInput(data);
    router.push('/scan');
  };
}
