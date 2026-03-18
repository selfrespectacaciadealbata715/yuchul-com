'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('yuchul_logged_in'));
  }, [pathname]);

  const navItems = [
    { label: '홈', href: '/' },
    { label: '스캔', href: '/scan' },
    { label: '대시보드', href: '/dashboard' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-card/90 border-b border-dark-border backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white leading-tight">
                유출닷컴
              </span>
              <span className="text-[10px] text-gray-500 leading-tight tracking-wider">
                yuchul.com
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gradient-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-smooth"
              >
                대시보드
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-400 hover:text-white transition-smooth"
                >
                  로그인
                </Link>
                <Link
                  href="/scan"
                  className="px-4 py-2 bg-gradient-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-smooth"
                >
                  무료 스캔
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-400 hover:text-white transition-smooth"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-dark-border pt-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-smooth ${
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-dark-border space-y-2">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="block text-center px-4 py-2 bg-gradient-primary text-white rounded-lg text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  대시보드
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block text-center text-sm text-gray-400 hover:text-white py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link
                    href="/scan"
                    className="block text-center px-4 py-2 bg-gradient-primary text-white rounded-lg text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    무료 스캔
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
