'use client';

import Link from 'next/link';
import { Mail, Github, Heart } from 'lucide-react';
import OpenSourceBadge from './OpenSourceBadge';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-card border-t border-dark-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">유</span>
              </div>
              <span className="text-lg font-bold gradient-text">유출닷컴</span>
            </div>
            <p className="text-gray-400 text-sm mb-3">
              당신의 개인정보 보호를 위한 무료 오픈소스 서비스
            </p>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">100% 무료</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">오픈소스</span>
            </div>
          </div>

          {/* Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/scan" className="hover:text-primary transition-smooth">
                  유출 확인
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-primary transition-smooth"
                >
                  대시보드
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-smooth">
                  가격
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">정보</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a
                  href="https://github.com/memekr/yuchul-com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-smooth flex items-center space-x-1"
                >
                  <Github size={14} />
                  <span>GitHub 소스코드</span>
                </a>
              </li>
              <li>
                <Link href="#faq" className="hover:text-primary transition-smooth">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="hover:text-primary transition-smooth">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="#terms" className="hover:text-primary transition-smooth">
                  이용약관
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">문의</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <a
                  href="mailto:spdish12@gmail.com"
                  className="hover:text-primary transition-smooth"
                >
                  spdish12@gmail.com
                </a>
              </li>
            </ul>

            {/* Open Source Info */}
            <div className="mt-4 p-3 bg-primary/5 border border-primary/10 rounded-lg">
              <div className="flex items-center space-x-1 mb-1">
                <Heart size={12} className="text-red-400" />
                <span className="text-xs font-medium text-gray-300">오픈소스 프로젝트</span>
              </div>
              <p className="text-xs text-gray-500">
                MIT 라이선스로 공개. 기여를 환영합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} 유출닷컴. MIT License | 개인정보보호법(PIPA) 준수
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <OpenSourceBadge variant="footer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
