'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Shield, Search, Database } from 'lucide-react';
import AdBanner from './AdBanner';

interface LoadingWithAdProps {
  progress: number;
  type: 'scan' | 'removal';
}

const scanSteps = [
  { threshold: 0, icon: Shield, text: '다크웹 데이터베이스 검색중...' },
  { threshold: 20, icon: Search, text: '검색엔진 노출 확인중...' },
  { threshold: 40, icon: Database, text: '데이터브로커 사이트 스캔중...' },
  { threshold: 60, icon: Shield, text: '유출 데이터 분석중...' },
  { threshold: 80, icon: CheckCircle, text: '보안 리포트 생성중...' },
];

const removalSteps = [
  { threshold: 0, icon: Shield, text: '삭제 요청서 생성중...' },
  { threshold: 25, icon: Search, text: '데이터 컨트롤러 확인중...' },
  { threshold: 50, icon: Database, text: 'PIPA 기반 요청서 작성중...' },
  { threshold: 75, icon: CheckCircle, text: '삭제 요청 발송중...' },
];

export default function LoadingWithAd({ progress, type }: LoadingWithAdProps) {
  const steps = type === 'scan' ? scanSteps : removalSteps;

  return (
    <div className="bg-dark-card border border-primary/20 rounded-2xl p-8 mb-8 animate-slideIn">
      <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
        <span>{type === 'scan' ? '스캔 진행중...' : '삭제 요청 처리중...'}</span>
      </h3>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>진행 상황</span>
          <span>{Math.min(progress, 100)}%</span>
        </div>
        <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-primary transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2 text-sm text-gray-400 mb-8">
        {steps.map((step, index) => {
          if (progress < step.threshold) return null;
          const Icon = step.icon;
          return (
            <div key={index} className="flex items-center space-x-2 animate-slideIn">
              <Icon size={16} className={progress > step.threshold + 15 ? 'text-success' : 'text-primary animate-pulse'} />
              <span>{step.text}</span>
            </div>
          );
        })}
      </div>

      {/* Ad placement during loading */}
      <div className="border-t border-dark-border pt-6">
        <AdBanner variant="loading" />
      </div>

      {/* Security tip */}
      <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-lg">
        <p className="text-xs text-gray-400">
          <strong className="text-primary">보안 팁:</strong>{' '}
          {type === 'scan'
            ? '비밀번호를 정기적으로 변경하고, 2단계 인증을 활성화하세요.'
            : '삭제 요청이 완료되면 이메일로 확인 알림을 보내드립니다.'}
        </p>
      </div>
    </div>
  );
}
