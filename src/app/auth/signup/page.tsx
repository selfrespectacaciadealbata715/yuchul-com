'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('모든 필드를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    if (!formData.agreedToTerms) {
      setError('이용약관에 동의해주세요.');
      setIsLoading(false);
      return;
    }

    // Mock signup - move to verification
    setTimeout(() => {
      setStep('verify');
      setIsLoading(false);
    }, 1000);
  };

  const handleVerify = () => {
    router.push('/dashboard');
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 animate-slideIn">
            <CheckCircle className="text-success" size={40} />
          </div>

          <h1 className="text-2xl font-bold mb-2">이메일 확인</h1>
          <p className="text-gray-400 mb-8">
            확인 이메일이 {formData.email}로 발송되었습니다.
            링크를 클릭하여 계정을 활성화해주세요.
          </p>

          <button
            onClick={handleVerify}
            className="w-full px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-smooth mb-4"
          >
            계속하기
          </button>

          <p className="text-gray-500 text-sm">
            이메일을 받지 못하셨나요?{' '}
            <button className="text-primary hover:underline">
              다시 발송
            </button>
          </p>

          <Link
            href="/auth/login"
            className="text-gray-500 hover:text-gray-400 text-sm transition-smooth mt-6 block"
          >
            이미 계정이 있으신가요? 로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">유철</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">회원가입</h1>
          <p className="text-gray-400">
            계정을 만들고 대시보드에 접속하세요.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              이름
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="홍길동"
                className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg text-gray-300 placeholder-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
              />
            </div>
          </div>

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

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-dark-card border-dark-border mt-1"
            />
            <label className="text-sm text-gray-400">
              <a href="#terms" className="text-primary hover:underline">
                이용약관
              </a>
              과{' '}
              <a href="#privacy" className="text-primary hover:underline">
                개인정보처리방침
              </a>
              에 동의합니다
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-smooth flex items-center justify-center space-x-2"
          >
            <span>{isLoading ? '가입 중...' : '회원가입'}</span>
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
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-gray-300 font-medium hover:border-primary transition-smooth"
            >
              Google로 가입
            </button>

            <button
              type="button"
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-gray-300 font-medium hover:border-primary transition-smooth"
            >
              Kakao로 가입
            </button>
          </div>
        </div>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
