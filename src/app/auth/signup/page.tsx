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
      setError('ê°ì ì¤ ì¤ë¥ê° ë°ìíìµëë¤.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-sm">ì ì¶</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">íìê°ì</h1>
          <p className="text-gray-400">
            Google ê³ì ì¼ë¡ ê°ìíê³  ëìë³´ëì ì ìíì¸ì.
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
          <span>{isLoading ? 'ê°ì ì¤...' : 'Googleë¡ ê°ì'}</span>
          {!isLoading && <ArrowRight size={20} />}
        </button>

        {/* Terms & Privacy */}
        <p className="text-center text-sm text-gray-400 mb-8">
          ê°ìíë©´{' '}
          <a href="#terms" className="text-primary hover:underline">
            ì´ì©ì½ê´
          </a>
          ê³¼{' '}
          <a href="#privacy" className="text-primary hover:underline">
            ê°ì¸ì ë³´ì²ë¦¬ë°©ì¹¨
          </a>
          ì ëìí©ëë¤
        </p>

        {/* Login Link */}
        <div className="text-center mb-6">
          <p className="text-gray-400">
            ì´ë¯¸ ê³ì ì´ ìì¼ì ê°ì?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              ë¡ê·¸ì¸
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-400 text-sm transition-smooth"
          >
            íì¼ë¡ ëìê°ê¸°
          </Link>
        </div>
      </div>
    </div>
  );
}
