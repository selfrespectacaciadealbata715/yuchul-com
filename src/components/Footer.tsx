'use client';

import Link from 'next/link';
import { Shield, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-card/50 border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Shield className="text-white" size={16} />
              </div>
              <div>
                <span className="text-sm font-bold text-white">유출닷컴</span>
                <span className="text-[9px] text-gray-500 ml-1">yuchul.com</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              개인정보 유출 확인 및 보호를 위한 무료 서비스
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">서비스</h4>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><Link href="/scan" className="hover:text-primary transition-smooth">유출 확인</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-smooth">대시보드</Link></li>
              <li><Link href="/dashboard/removal" className="hover:text-primary transition-smooth">삭제 요청</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">정보</h4>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><Link href="#privacy" className="hover:text-primary transition-smooth">개인정보처리방침</Link></li>
              <li><Link href="#terms" className="hover:text-primary transition-smooth">이용약관</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">문의</h4>
            <a href="mailto:support@yuchul.com" className="flex items-center space-x-2 text-gray-400 text-xs hover:text-primary transition-smooth">
              <Mail size={14} />
              <span>support@yuchul.com</span>
            </a>
          </div>
        </div>

        <div className="border-t border-dark-border pt-6">
          <p className="text-gray-500 text-xs text-center">
            © {currentYear} 유출닷컴 yuchul.com. 개인정보보호법(PIPA) 준수.
          </p>
        </div>
      </div>
    </footer>
  );
}
