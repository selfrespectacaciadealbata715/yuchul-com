'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { pendingScanInput } = useAppStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPending, setHasPending] = useState(false);

  useEffect(() => {
    // Check if there's pending scan data
    try {
      const pending = localStorage.getItem('yuchul_pending_scan');
      if (pending) setHasPending(true);
    } catch {}
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.email && formData.password) {
      // Mark as logged in
      localStorage.setItem('yuchul_logged_in', 'true');
      setTimeout(() => {
        // If there's pending scan data, go to scan page; otherwise dashboard
        if (hasPending) {
          router.push('/scan');
        } else {
          router.push('/dashboard');
        }
      }, 500);
    } else {
      setError('이메일과 비밀번호를 입력해주세요.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold mb-2">로그인</h1>
          <p className="text-gray-400 text-sm">
            유출닷컴에 로그인하여 개인정보를 관리하세요.
          </p>
        </div>

        {/* Pending scan notice */}
        {hasPending && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <p className="text-sm text-primary">
              입력하신 정보가 저장되어 있습니다. 로그인 후 바로 스캔이 시작됩니다.
            </p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-gray-300 placeholder-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-gray-300 placeholder-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-smooth flex items-center justify-center space-x-2"
          >
            <span>{isLoading ? '로그인 중...' : '로그인'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* OAuth */}
        <div className="mt-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-dark-bg text-gray-500">또는</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-gray-300 font-medium hover:border-primary/50 transition-smooth"
          >
            Google로 로그인
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            계정이 없으신가요?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline">
              가입하기
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm transition-smooth">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
