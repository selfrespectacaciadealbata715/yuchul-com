'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signInWithGoogle } from '@/lib/supabase';
import { ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError('');

    try {
      await signInWithGoogle();
    } catch (err) {
      setError('가입 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-sm">유출</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">회원가입</h1>
          <p className="text-gray-400">
            Google 계정으로 가입하고 대시보드에 접속하세요.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg mb-6">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-smooth flex items-center justify-center space-x-2 mb-6"
        >
          <span>{isLoading ? '가입 중...' : 'Google로 가입'}</span>
          {!isLoading && <ArrowRight size={20} />}
        </button>

        {/* Terms & Privacy */}
        <p className="text-center text-sm text-gray-400 mb-8">
          가입하면{' '}
          <a href="#terms" className="text-primary hover:underline">
            이용약관
          </a>
          과{' '}
          <a href="#privacy" className="text-primary hover:underline">
            개인정보처리방침
          </a>
          에 동의합니다
        </p>

        {/* Login Link */}
        <div className="text-center mb-6">
          <p className="text-gray-400">
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              로그인
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center">
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
