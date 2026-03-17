'use client';

import { CheckCircle, Zap, Shield, Bell, BarChart3, Lock } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const features = [
    {
      icon: Shield,
      title: '다크웹 유출 확인',
      description: '알려진 대규모 데이터 유출에서 당신의 정보가 있는지 확인합니다.',
    },
    {
      icon: BarChart3,
      title: '검색엔진 노출 스캔',
      description: '검색엔진과 데이터브로커 사이트에서 당신의 정보를 찾습니다.',
    },
    {
      icon: Zap,
      title: '자동 PIPA 삭제 요청',
      description:
        '개인정보보호법 기반의 자동화된 삭제 요청을 생성하고 관리합니다.',
    },
    {
      icon: Bell,
      title: '실시간 알림',
      description: '새로운 유출이 발견되면 즉시 이메일과 웹 알림을 받습니다.',
    },
    {
      icon: Lock,
      title: '완전 무료',
      description: '숨겨진 비용이 없습니다. 모든 기능이 100% 무료입니다.',
    },
    {
      icon: BarChart3,
      title: '월간 보안 리포트',
      description: '상세한 보안 리포트와 권장사항을 매달 받습니다.',
    },
  ];

  const comparison = [
    {
      feature: '다크웹 유출 확인',
      yuchul: true,
      competitors: ['유료', '유료', '유료'],
    },
    {
      feature: '데이터브로커 스캔',
      yuchul: true,
      competitors: ['제한됨', '유료', '유료'],
    },
    {
      feature: '자동 삭제 요청',
      yuchul: true,
      competitors: [false, '유료', '제한됨'],
    },
    {
      feature: '실시간 알림',
      yuchul: true,
      competitors: ['제한됨', '제한됨', '유료'],
    },
    {
      feature: '월간 리포트',
      yuchul: true,
      competitors: ['기본만', '기본만', '유료'],
    },
    {
      feature: '한국어 지원',
      yuchul: true,
      competitors: [false, false, true],
    },
    {
      feature: 'PIPA 준수',
      yuchul: true,
      competitors: ['아니오', '아니오', '부분'],
    },
  ];

  const faq = [
    {
      question: '정말 완전히 무료인가요?',
      answer:
        '네, 유출닷컴은 100% 무료입니다. 숨겨진 비용이나 프리미엄 버전이 없습니다.',
    },
    {
      question: '개인정보는 안전한가요?',
      answer:
        '네, 우리는 개인정보보호법을 완전히 준수합니다. 당신의 정보는 암호화되어 보호되며, 제3자와 공유하지 않습니다.',
    },
    {
      question: '얼마나 자주 스캔할 수 있나요?',
      answer:
        '스캔은 제한 없이 언제든지 실행할 수 있습니다. 원하는 만큼 자주 스캔하세요.',
    },
    {
      question: '회원가입이 필요한가요?',
      answer:
        '아니오, 회원가입 없이 바로 스캔을 시작할 수 있습니다. 대시보드를 사용하려면 이메일로 가입하세요.',
    },
    {
      question: '유출이 발견되면 어떻게 되나요?',
      answer:
        '우리가 PIPA 기반의 자동화된 삭제 요청을 생성합니다. 당신은 이를 해당 회사에 발송하면 됩니다.',
    },
    {
      question: '얼마나 빠르게 삭제되나요?',
      answer:
        '삭제 기간은 개인정보를 보유한 회사에 따라 다릅니다. 일반적으로 30일 이내에 처리됩니다.',
    },
  ];

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
          유출닷컴은 모든 기능을 완전히 무료로 제공합니다.
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
          유출닷컴 vs 다른 서비스
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-dark-border">
          <table className="w-full text-sm">
            <thead className="bg-dark-card border-b border-dark-border">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">기능</th>
                <th className="px-6 py-4 text-center font-semibold text-primary">
                  유출닷컴
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
            유출닷컴은 한국을 위해 특별히 설계되었습니다
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
