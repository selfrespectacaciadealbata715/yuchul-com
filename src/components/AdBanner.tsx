'use client';

import { useState, useEffect } from 'react';

type AdVariant = 'banner' | 'card' | 'inline' | 'loading';

interface AdBannerProps {
  variant?: AdVariant;
  className?: string;
}

const adPool = [
  {
    id: 'coupang',
    title: '쿠팡 추천 상품',
    description: '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.',
    url: 'https://link.coupang.com/a/dWLQV1',
    image: '/coupang-banner.png',
    label: '쿠팡파트너스',
  },
  {
    id: 'gamsgo',
    title: 'AI 서비스 최저가',
    description: 'ChatGPT, Claude, Midjourney 등 AI 서비스를 최저가로 이용하세요.',
    url: 'https://www.gamsgo.com/partner/GfENE',
    image: null,
    label: 'GAMSGO',
  },
];

export default function AdBanner({ variant = 'banner', className = '' }: AdBannerProps) {
  const [currentAd, setCurrentAd] = useState(adPool[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Rotate ads randomly
    const randomIndex = Math.floor(Math.random() * adPool.length);
    setCurrentAd(adPool[randomIndex]);
  }, []);

  if (!isVisible) return null;

  if (variant === 'loading') {
    return (
      <div className={`relative bg-dark-card border border-dark-border rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <span className="text-xs text-gray-500 mb-3 block">광고</span>
          <a
            href={currentAd.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block hover:opacity-90 transition-opacity"
          >
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-6 mb-3">
              <div className="text-sm font-medium text-primary mb-1">{currentAd.label}</div>
              <div className="text-lg font-bold text-white mb-2">{currentAd.title}</div>
              <p className="text-sm text-gray-400">{currentAd.description}</p>
            </div>
          </a>
          {/* Second ad if available */}
          {adPool.length > 1 && (
            <a
              href={adPool.find((a) => a.id !== currentAd.id)?.url || adPool[1].url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="block hover:opacity-90 transition-opacity mt-3"
            >
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-400 mb-1">
                  {adPool.find((a) => a.id !== currentAd.id)?.label}
                </div>
                <div className="text-md font-semibold text-white">
                  {adPool.find((a) => a.id !== currentAd.id)?.title}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {adPool.find((a) => a.id !== currentAd.id)?.description}
                </p>
              </div>
            </a>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`relative bg-dark-card border border-dark-border rounded-xl p-5 ${className}`}>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-300 text-xs"
        >
          ✕
        </button>
        <span className="text-xs text-gray-500 mb-2 block">광고</span>
        <a
          href={currentAd.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="block hover:opacity-90 transition-opacity"
        >
          <div className="text-sm font-medium text-primary mb-1">{currentAd.label}</div>
          <div className="text-base font-semibold text-white mb-1">{currentAd.title}</div>
          <p className="text-xs text-gray-400">{currentAd.description}</p>
        </a>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`relative ${className}`}>
        <a
          href={currentAd.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center space-x-3 px-4 py-3 bg-dark-card/50 border border-dark-border rounded-lg hover:border-primary/30 transition-smooth"
        >
          <span className="text-xs text-gray-500 flex-shrink-0">AD</span>
          <span className="text-sm text-gray-300">{currentAd.title}</span>
          <span className="text-xs text-primary ml-auto flex-shrink-0">자세히 &rarr;</span>
        </a>
      </div>
    );
  }

  // Default: banner
  return (
    <div className={`relative ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <a
          href={currentAd.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center justify-between px-5 py-3 bg-dark-card border border-dark-border rounded-xl hover:border-primary/30 transition-smooth"
        >
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500 px-2 py-0.5 bg-dark-border/50 rounded">AD</span>
            <span className="text-sm text-gray-300">{currentAd.title}</span>
            <span className="text-xs text-gray-500 hidden sm:inline">{currentAd.description}</span>
          </div>
          <span className="text-xs text-primary flex-shrink-0">자세히 &rarr;</span>
        </a>
      </div>
    </div>
  );
}
