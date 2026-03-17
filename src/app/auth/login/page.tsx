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