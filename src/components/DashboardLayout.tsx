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
  Search,
  Shield,
  LogOut,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: '스캔하기', href: '/scan', icon: Search },
    { label: '개요', href: '/dashboard', icon: BarChart3 },
    { label: '유출 현황', href: '/dashboard/findings', icon: AlertCircle },
    { label: '삭제 요청', href: '/dashboard/removal', icon: FileText },
    { label: '월간 리포트', href: '/dashboard/report', icon: BarChart3 },
    { label: '설정', href: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-dark-bg">
      {/* Mobile Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-20 right-4 z-40 p-2 bg-dark-card rounded-lg border border-dark-border shadow-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={"fixed md:sticky top-0 left-0 h-screen w-64 bg-dark-card border-r border-dark-border z-30 transform transition-transform duration-300 " + (
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-5 border-b border-dark-border">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Shield className="text-white" size={18} />
              </div>
              <div>
                <span className="text-sm font-bold text-white">유출닷컴</span>
                <span className="text-[9px] text-gray-500 ml-1">yuchul.com</span>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={"flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-smooth text-sm " + (
                    active
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.label === '스캔하기' && (
                    <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-dark-border">
            <Link
              href="/"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('yuchul_logged_in');
                }
              }}
              className="flex items-center space-x-2 px-3 py-2.5 text-sm text-gray-400 hover:text-white transition-smooth rounded-lg hover:bg-white/5"
            >
              <LogOut size={18} />
              <span>로그아웃</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-h-screen overflow-y-auto">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}