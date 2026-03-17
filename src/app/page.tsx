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
    // Save input to store + localStorage, then redirect to scan page
    setPendingScanInput(data);
    router.push('/scan');
  };

  const features = [
    {
      icon: Shield,
      title: '다크웹 유출 확인',
      description: '당신의 정보가 다크웹에 유출되었는지 실시간으로 확인합니다.',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      icon: Search,
      title: '데이터브로커 스캔',
      description: '데이터브로커 사이트에서 당신의 개인정보를 추적합니다.',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Zap,
      title: '자동 삭제 요청',
      description: '개인정보보호법(PIPA) 기반 자동 삭제 요청흄 발송합니다.',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      icon: Bell,
      title: '실시간 모니터링',
      description: '새로운 유출이 발견되면 즉시 알림을 보내드립니다.',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
  ];

  const stats = [
    { value: '10억+', label: '분석된 유출 데이터' },
    { value: '다시간', label: '모니터링' },
    { value: '100%', label: '무료' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-16 px-4 overflow-hidden">
        <div className="absolute inset-0">