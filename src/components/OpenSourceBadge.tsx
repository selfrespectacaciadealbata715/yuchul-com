'use client';

import { Github, Heart } from 'lucide-react';

interface OpenSourceBadgeProps {
  variant?: 'hero' | 'footer' | 'compact';
}

export default function OpenSourceBadge({ variant = 'compact' }: OpenSourceBadgeProps) {
  if (variant === 'hero') {
    return (
      <div className="mt-8 p-6 bg-dark-card border border-primary/10 rounded-2xl max-w-2xl mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Heart size={18} className="text-red-400" />
          <span className="text-sm font-semibold text-gray-200">
            100% 무료 오픈소스 프로젝트
          </span>
        </div>
        <p className="text-sm text-gray-400 text-center mb-4">
          유출닷컴은 수익 목적이 아닌 개인정보 보호를 위한 비영리 오픈소스 프로젝트입니다.
          모든 코드가 공개되어 있으며, 누구나 기여할 수 있습니다.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <a
            href="https://github.com/memekr/yuchul-com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-dark-border/50 hover:bg-dark-border rounded-lg transition-smooth text-sm text-gray-300"
          >
            <Github size={16} />
            <span>GitHub에서 보기</span>
          </a>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full">MIT License</span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">$0 운영비</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="flex items-center justify-center space-x-4 py-4">
        <a
          href="https://github.com/memekr/yuchul-com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-primary transition-smooth text-sm"
        >
          <Github size={16} />
          <span>오픈소스</span>
        </a>
        <span className="text-gray-600">•</span>
        <span className="text-xs text-gray-500">MIT License</span>
        <span className="text-gray-600">•</span>
        <span className="text-xs text-green-400/70">100% 무료</span>
      </div>
    );
  }

  // compact
  return (
    <a
      href="https://github.com/memekr/yuchul-com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center space-x-1 text-xs text-gray-500 hover:text-primary transition-smooth"
    >
      <Github size={12} />
      <span>오픈소스</span>
    </a>
  );
}
