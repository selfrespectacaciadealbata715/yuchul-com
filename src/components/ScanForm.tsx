'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import type { ScanInput } from '@/lib/types';

interface ScanFormProps {
  onSubmit: (data: ScanInput) => void;
  isLoading?: boolean;
  buttonText?: string;
}

export default function ScanForm({
  onSubmit,
  isLoading = false,
  buttonText = '지금 스캔',
}: ScanFormProps) {
  const [formData, setFormData] = useState<ScanInput>({
    name: '',
    email: '',
    phone: '',
    username: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email || formData.phone || formData.name || formData.username) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            이름
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="홍길동"
            className="w-full px-4 py-3 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            이메일
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
            className="w-full px-4 py-3 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            전화번호
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="010-1234-5678"
            className="w-full px-4 py-3 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            사용자명
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="username123"
            className="w-full px-4 py-3 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full md:w-auto px-8 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-smooth flex items-center justify-center space-x-2"
      >
        <Search size={18} />
        <span>{isLoading ? '스캔 중...' : buttonText}</span>
      </button>
    </form>
  );
}
