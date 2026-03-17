'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  FileText,
  Settings,
  AlertCircle,
  Menu,
  X,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    {
      label: '개요',
      href: '/dashboard',
      icon: BarChart3,
    },
    {
      label: '유출 현황',
      href: '/dashboard/findings',
      icon: AlertCircle,
    },
    {
      label: '삭제 요청',
      href: '/dashboard/removal',
      icon: FileText,
    },
    {
      label: '월간 리포트',
      href: '/dashboard/report',
      icon: BarChart3,
    },
    {
      label: '설정',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dark-bg">
      {/* Mobile Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-20 right-4 z-40 p-2 bg-dark-card rounded-lg border border-dark-border"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed md:relative w-full md:w-64 h-screen md:h-auto bg-dark-card border-r border-dark-border z-30 md:z-0">
          <div className="p-6 border-b border-dark-border">
            <h2 className="text-lg font-bold gradient-text">대시보드</h2>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth ${
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-gray-400 hover:text-primary hover:bg-dark-border'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-border">
            <Link
              href="/auth/login"
              className="text-sm text-gray-400 hover:text-primary transition-smooth"
            >
              로그아웃
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-20 md:pt-0">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
