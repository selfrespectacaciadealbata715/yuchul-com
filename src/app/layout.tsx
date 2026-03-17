import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '유출닷컴 - 내 개인정보 유출 확인 & 자동 삭제 요청 | 100% 무료 오픈소스',
  description:
    '내 개인정보가 다크웹이나 데이터브로커에 유출되었는지 무료로 확인하세요. Google 로그인으로 간편 시작, 자동 PIPA 삭제 요청. 100% 무료 오픈소스 프로젝트.',
  keywords: [
    '개인정보',
    '유출',
    '확인',
    '다크웹',
    '개인정보보호',
    '개인정보보호법',
    '데이터브로커',
    'PIPA',
    '삭제요청',
    '무료',
    '오픈소스',
    '유출닷컴',
  ],
  viewport: 'width=device-width, initial-scale=1.0',
  robots: 'index, follow',
  openGraph: {
    title: '유출닷컴 - 내 개인정보 유출 확인 & 삭제 요청',
    description: '다크웹, 검색엔진, 데이터브로커 — 유출 확인부터 삭제 요청까지. 100% 무료 오픈소스.',
    url: 'https://yuchul.com',
    siteName: '유출닷컴',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '유출닷컴 - 내 개인정보 유출 확인',
    description: '100% 무료 오픈소스 개인정보 보호 플랫폼',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="canonical" href="https://yuchul.com" />
      </head>
      <body className="bg-dark-bg text-gray-200">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
