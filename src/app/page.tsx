'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { supabase, signInWithGoogle, canScan } from '@/lib/supabase';
import ScanForm from '@/components/ScanForm';
import AdBanner from '@/components/AdBanner';
import OpenSourceBadge from '@/components/OpenSourceBadge';
import { Shield, Search, Bell, Zap, CheckCircle, ArrowRight, Github, Heart, Lock } from 'lucide-react';
import type { ScanInput } from '@/lib/types';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { setScanResults, setIsScanning, setScanProgress } = useAppStore();
  const [user, setUser] = useState<User | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleScan = async (data: ScanInput) => {
    // Check if user is logged in
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    // Check scan limit
    const scanStatus = canScan();
    if (!scanStatus.allowed) {
      alert(`주간 스캔 한도(2회)에 도달했습니다. ${scanStatus.nextReset.toLocaleDateString('ko-KR')}에 초기화됩니다.`);
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    router.push('/scan');
  };

  const features = [
    {
      icon: Shield,
      title: '다크웹 유출 확인',
      description: '당신의 정보가 다크웹에 유출되었는지 확인합니다.',
    },
    {
      icon: Search,
      title: '검색엔진 노출 스캔',
      description: '검색엔진과 데이터브로커 사이트에서 당신의 정보를 찾습니다.',
    },
    {
      icon: Zap,
      title: '자동 삭제 요청',
      description: 'PIPA 기반 자동화된 개인정보 삭제 요청을 생성합니다.',
    },
    {
      icon: Bell,
      title: '실시간 알림',
      description: '새로운 유출이 발견되면 즉시 알림을 받습니다.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Google 로그인',
      description: 'Google 계정으로 간편하게 로그인합니다.',
    },
    {
      number: '2',
      title: '정보 입력 & 스캔',
      description: '이메일을 입력하면 다크웹과 데이터브로커를 검사합니다.',
    },
    {
      number: '3',
      title: '결과 확인 및 삭제',
      description: '발견된 유출을 확인하고 자동 삭제를 요청합니다.',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Open Source Badge */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <span className="text-sm text-primary font-medium">100% 무료 오픈소스</span>
            </div>
            <a
              href="https://github.com/memekr/yuchul-com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-3 py-2 bg-dark-card border border-dark-border rounded-full hover:border-primary/30 transition-smooth"
            >
              <Github size={14} className="text-gray-400" />
              <span className="text-xs text-gray-400">Star</span>
            </a>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            개인정보 유출,<br />지금 바로 확인하세요
          </h1>

          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            당신의 개인정보가 다크웹이나 데이터브로커에 유출되었는지
            무료로 확인하고, 자동으로 삭제를 요청하세요.
          </p>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 glass-morphism">
            {showLoginPrompt && !user ? (
              <div className="text-center py-6">
                <Lock size={40} className="mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">로그인이 필요합니다</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  스팸 방지를 위해 Google 로그인 후 스캔할 수 있습니다.
                </p>
                <button
                  onClick={() => signInWithGoogle()}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-smooth font-medium"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Google로 로그인</span>
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  주 2회 무료 스캔 가능 • 개인정보는 저장하지 않습니다
                </p>
              </div>
            ) : (
              <ScanForm onSubmit={handleScan} buttonText="무료로 시작하기" />
            )}
          </div>

          <p className="text-sm text-gray-500 mt-6">
            ✓ Google 로그인으로 간편 시작 • ✓ 주 2회 무료 스캔 • ✓ 개인정보보호법 준수
          </p>

          {/* Open Source Emphasis */}
          <OpenSourceBadge variant="hero" />
        </div>
      </section>

      {/* Non-intrusive Ad Banner */}
      <div className="py-4">
        <AdBanner variant="banner" />
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 bg-dark-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              당신의 정보를 보호하세요
            </h2>
            <p className="text-gray-400 text-lg">
              포괄적인 개인정보 보호 기능들을 경험하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary/50 transition-smooth group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-smooth">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            어떻게 작동하나요?
          </h2>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 md:gap-12">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold mb-4">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-1 h-20 bg-gradient-to-b from-primary to-transparent" />
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-dark-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            가격이 궁금하신가요?
          </h2>

          <div className="text-center mb-16">
            <div className="text-6xl font-bold gradient-text mb-4">₩0</div>
            <p className="text-xl text-gray-400 mb-4">
              완전히 무료입니다. 지금 바로 시작하세요.
            </p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <Heart size={14} className="text-red-400" />
              <span className="text-sm text-green-400">오픈소스 비영리 프로젝트</span>
            </div>
          </div>

          <div className="bg-dark-card border border-primary/20 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-8">
              <CheckCircle className="text-success" size={24} />
              <span className="text-lg font-semibold">
                모든 기능이 무료로 제공됩니다
              </span>
            </div>

            <ul className="space-y-3 text-left max-w-md mx-auto mb-8">
              <li className="flex items-center space-x-3 text-gray-300">
                <CheckCircle size={20} className="text-success flex-shrink-0" />
                <span>다크웹 유출 확인 (주 2회)</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <CheckCircle size={20} className="text-success flex-shrink-0" />
                <span>검색엔진 노출 스캔</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <CheckCircle size={20} className="text-success flex-shrink-0" />
                <span>자동 PIPA 삭제 요청</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <CheckCircle size={20} className="text-success flex-shrink-0" />
                <span>실시간 알림</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <CheckCircle size={20} className="text-success flex-shrink-0" />
                <span>월간 보안 리포트</span>
              </li>
            </ul>

            <Link
              href="/scan"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-smooth"
            >
              <span>지금 시작하기</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Inline Ad */}
      <div className="py-4">
        <div className="max-w-4xl mx-auto px-4">
          <AdBanner variant="inline" />
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            당신의 개인정보를 보호하세요
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            지금 바로 스캔을 시작하고 당신의 정보 보안 상태를 확인하세요.
            빠르고 간단합니다.
          </p>
          <Link
            href="/scan"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-smooth"
          >
            <span>지금 스캔하기</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
