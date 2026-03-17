'use client';

import Link from 'next/link';
import {
  Search,
  Bell,
  Trash2,
  BarChart3,
  Lock,
  Zap,
  CheckCircle,
  Code,
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: '개인정보 유출 스캔',
    description: '다크웹, 서피스웹 등에서 유출된 개인정보를 탐색합니다.',
  },
  {
    icon: Trash2,
    title: '삭제 요청',
    description: '유출된 개인정보의 삭제를 요청할 수 있습니다.',
  },
  {
    icon: Bell,
    title: '실시간 알림',
    description: '새로운 유출이 발견되면 즉시 알려드립니다.',
  },
  {
    icon: BarChart3,
    title: '보안 리포트',
    description: '주간/월간 보안 리포트를 제공합니다.',
  },
  {
    icon: Lock,
    title: '개인정보 보호',
    description: '사용자의 개인정보를 안전하게 보호합니다.',
  },
  {
    icon: Code,
    title: '오픈소스',
    description: '모든 코드가 공개되어 있어 투명합니다.',
  },
];

const comparison = [
  { feature: '가격', yuchul: true, competitors: ['₩9,900/월', '₩14,900/월', '₩19,900/월'] },
  { feature: '유출 스캔', yuchul: true, competitors: [true, true, true] },
  { feature: '삭제 요청', yuchul: true, competitors: [false, true, true] },
  { feature: '실시간 알림', yuchul: true, competitors: [false, false, true] },
  { feature: '보안 리포트', yuchul: true, competitors: [false, true, true] },
  { feature: '오픈소스', yuchul: true, competitors: [false, false, false] },
  { feature: '한국어 지원', yuchul: true, competitors: [false, false, true] },
];

const faq = [
  {
    question: '정말 완전히 무료인가요?',
    answer:
      '네, 유철은 100% 무료입니다. 오픈소스 프로젝트로, 서버 운영비는 광고 수익으로 충당합니다.',
  },
  {
    question: '어떻게 수익을 내나요?',
    answer:
      '유철은 파트너 광고(쿠팡 파트너스, gamsgo 등)를 통해 운영비를 충당합니다. 사용자의 개인정보를 판매하지 않습니다.',
  },
  {
    question: '스캔 횟수에 제한이 있나요?',
    answer:
      '스팸 방지를 위해 주 2회로 제한되어 있습니다. 매주 월요일에 초기화됩니다.',
  },
  {
    question: '오픈소스라면 코드를 볼 수 있나요?',
    answer:
      '네, GitHub에서 모든 코드를 확인할 수 있습니다. 기여도 환영합니다!',
  },
  {
    question: '내 개인정보는 안전한가요?',
    answer:
      '유철은 사용자의 개인정보를 저장하지 않습니다. 스캔은 k-익명성(k-anonymity) API를 사용하여 안전하게 수행됩니다.',
  },
];

export default function PricingPage() {
  return (
    <div className="w-full min-h-screen bg-dark-bg py-20 px-4">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-20">
        <div className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
          <span className="text-sm text-primary font-medium">
            투명한 가격 정책
          </span>
        </div>

        <h1 className="text-5xl font-bold mb-6 gradient-text">
          완전히 무료입니다
        </h1>

        <p className="text-xl text-gray-400 mb-8">
          당신의 개인정보를 보호하는 것은 당신의 권리입니다.
          유철은 모든 기능을 완전히 무료로 제공합니다.
        </p>

        <div className="text-6xl font-bold mb-4">₩0</div>
        <p className="text-gray-400 mb-8">
          숨겨진 비용이나 프리미엄 버전이 없습니다.
        </p>

        <Link
          href="/scan"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-smooth text-lg"
        >
          <span>지금 시작하기</span>
          <Zap size={24} />
        </Link>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">
          모든 기능이 무료로 제공됩니다
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary/50 transition-smooth"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-smooth">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">
          유철 vs 다른 서비스
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-dark-border">
          <table className="w-full text-sm">
            <thead className="bg-dark-card border-b border-dark-border">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">기능</th>
                <th className="px-6 py-4 text-center font-semibold text-primary">
                  유철
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-400">
                  경쟁사 A
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-400">
                  경쟁사 B
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-400">
                  경쟁사 C
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-dark-border hover:bg-dark-card/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {row.feature}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.yuchul ? (
                      <CheckCircle className="inline text-success" size={20} />
                    ) : (
                      <span className="text-gray-500">✗</span>
                    )}
                  </td>
                  {row.competitors.map((competitor, idx) => (
                    <td
                      key={idx}
                      className="px-6 py-4 text-center text-gray-400"
                    >
                      {competitor === true ? (
                        <CheckCircle className="inline text-success" size={20} />
                      ) : competitor === false ? (
                        <span className="text-gray-500">✗</span>
                      ) : (
                        <span className="text-sm">{competitor}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-6 bg-primary/10 border border-primary/20 rounded-xl text-center">
          <p className="text-lg font-semibold mb-2">
            유철은 한국을 위해 특별히 설계되었습니다
          </p>
          <p className="text-gray-400">
            개인정보보호법(PIPA)을 완전히 준수하며, 한국의 개인정보 유출에
            최적화되어 있습니다.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">
          자주 묻는 질문
        </h2>

        <div className="space-y-4">
          {faq.map((item, index) => (
            <details
              key={index}
              className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-primary/50 transition-smooth group cursor-pointer"
            >
              <summary className="font-semibold text-white flex items-center justify-between">
                {item.question}
                <span className="text-primary group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="text-gray-400 mt-4">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-3xl mx-auto text-center">
        <div className="bg-dark-card border border-primary/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">지금 시작하세요</h2>
          <p className="text-gray-400 text-lg mb-8">
            당신의 개인정보 보호를 위해 지금 바로 스캔을 시작하세요.
            회원가입도 필요 없습니다.
          </p>

          <Link
            href="/scan"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-smooth"
          >
            <Zap size={20} />
            <span>무료 스캔 시작</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
