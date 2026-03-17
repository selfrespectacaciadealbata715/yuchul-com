'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock authentication
    if (formData.email && formData.password) {
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
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
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">유철</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">로그인</h1>
          <p className="text-gray-400">
            대시보드에 접속하여 당신의 개인정보를 관리하세요.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              이메일
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg text-gray-300 placeholder-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg text-gray-300 placeholder-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 text-gray-400">
              <input
                type="checkbox"
                className="w-4 h-4 rounded bg-dark-card border-dark-border"
              />
              <span>로그인 상태 유지</span>
            </label>
            <a href="#forgot" className="text-primary hover:underline">
              비밀번호 재설정
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-smooth flex items-center justify-center space-x-2"
          >
            <span>{isLoading ? '로그인 중...' : '로그인'}</span>
            <ArrowRight size={20} />
          </button>
        </form>

        {/* OAuth Options */}
        <div className="mt-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-bg text-gray-500">또는</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-gray-300 font-medium hover:border-primary transition-smooth flex items-center justify-center space-x-2"
            >
              <span>Google로 로그인</span>
            </button>

            <button
              type="button"
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-gray-300 font-medium hover:border-primary transition-smooth flex items-center justify-center space-x-2"
            >
              <span>Kakao로 로그인</span>
            </button>
          </div>
        </div>

        {/* Signup Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            아직 계정이 없으신가요?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline">
              가입하기
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-400 text-sm transition-smooth"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
                }
