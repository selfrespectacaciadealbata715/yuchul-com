'use client';

import { useState, useEffect } from 'react';
import { Search, Mail } from 'lucide-react';
import type { ScanInput } from '@/lib/types';

interface ScanFormProps {
  onSubmit: (data: ScanInput) => void;
  isLoading?: boolean;
  buttonText?: string;
  initialData?: ScanInput | null;
}

export default function ScanForm({
  onSubmit,
  isLoading = false,
  buttonText = '지금 스캔',
  initialData,
}: ScanFormProps) {
  const [formData, setFormData] = useState<ScanInput>({
    name: '',
    email: '',
    phone: '',
    username: '',
  });
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* Primary: Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          이메일 주소 <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="확인할 이메일 주소를 입력하세요"
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-dark-bg border border-dark-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth text-white placeholder-gray-600"
          />
        </div>
      </div>

      {/* Optional fields toggle */}
      <button
        type="button"
        onClick={() => setShowMore(!showMore)}
        className="text-xs text-gray-500 hover:text-primary transition-smooth"
      >
        {showMore ? '추가 정보 숨기기 ▲' : '추가 정보 입력 (선택사항) ▼'}
      </button>

      {showMore && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-slideIn">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">이름</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="홍길동"
              className="w-full px-3 py-2.5 rounded-lg bg-dark-bg border border-dark-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">전화번호</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className="w-full px-3 py-2.5 rounded-lg bg-dark-bg border border-dark-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">사용자명</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username123"
              className="w-full px-3 py-2.5 rounded-lg bg-dark-bg border border-dark-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth text-sm"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !formData.email}
        className="w-full px-8 py-3.5 bg-gradient-primary text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-40 transition-smooth flex items-center justify-center space-x-2"
      >
        <Search size={18} />
        <span>{isLoading ? '스캔 중...' : buttonText}</span>
      </button>
    </form>
  );
}
