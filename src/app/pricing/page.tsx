'use client';

import { CheckCircle, Zap, Shield, Bell, BarChart3, Lock } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const features = [
    {
      icon: Shield,
      title: 'ë¡íµªì¹ ì ì¶ íì¸',
      description: 'ìë ¤ì§ ëê·ëª¨ ë°ì´í° ì ì¶ìì ë¹ì ì ì ë³´ê° ìëì§ íì¸í©ëë¤.',
    },
    {
      icon: BarChart3,
      title: 'ê²ììì§ ë¸ì¶ ì¤ìº',
      description: 'ê²ììì§ê³¼ ë°ì´í°ë¸ë¡ì»¤ ì¬ì´í¸ìì ë¹ì ì ì ë³´ë¥¼ ì°¾ìµëë¤.',
    },
    {
      icon: Zap,
      title: 'ìë PIPA ì­ì  ìì²­',
      description:
        'ê°ì¸ì ë³´ë³´í¸ë² ê¸°ë°ì ìëíë ì­ì  ìì²­ì ìì±íê³  ê´ë¦¬í©ëë¤.',
    },
    {
      icon: Bell,
      title: 'ì¤ìê° ìë¦¼',
      description: 'ìë¡ì´ ì ì¶ì´ ë°ê²¬ëë©´ ì¦ì ì´ë©ì¼ê³¼ ì¹ ìë¦¼ì ë°ìµëë¤.',
    },
    {
      icon: Lock,
      title: 'ìì  ë¬´ë£',
      description: 'ì¨ê²¨ì§ ë¹ì©ì´ ììµëë¤. ëª¨ë  ê¸°ë¥ì´ 100% ë¬´ë£ìëë¤.',
    },
    {
      icon: BarChart3,
      title: 'ìê° ë³´ì ë¦¬í¬í¸',
      description: 'ìì¸í ë³´ì ë¦¬í¬í¸ì ê¶ì¥ì¬í­ì ë§¤ë¬ ë°ìµëë¤.',
    },
  ];

  const comparison = [
    {
      feature: 'ë¤í¬ì¹ ì ì¶ íì¸',
      yuchul: true,
      competitors: ['ì ë£', 'ì ë£', 'ì ë£'],
    },
    {
      feature: 'ë°ì´í°ë¸ë¡ì»¤ ì¤ìº',
      yuchul: true,
      competitors: ['ì íë¨', 'ì ë£', 'ì ë£'],
    },
    {
      feature: 'ìë ì­ì  ìì²­',
      yuchul: true,
      competitors: [false, 'ì ë£', 'ì íë¨'],
    },
    {
      feature: 'ì¤ìê° ìë¦¼',
      yuchul: true,
      competitors: ['ì íë¨', 'ì íë¨', 'ì ë£'],
    },
    {
      feature: 'ìê° ë¦¬í¬í¸',
      yuchul: true,
      competitors: ['ê¸°ë³¸ë§', 'ê¸°ë³¸ë§', 'ì ë£'],
    },
    {
      feature: 'íêµ­ì´ ì§ì',
      yuchul: true,
      competitors: [false, false, true],
    },
    {
      feature: 'PIPA ì¤ì',
      yuchul: true,
      competitors: ['ìëì¤', 'ìëì¤', 'ë¶ë¶'],
    },
  ];

  const faq = [
    {
      question: 'ì ë§ ìì í ë¬´ë£ì¸ê°ì?',
      answer:
        'ë¤, ì ì¶ë·ì»´ì 100% ë¬´ë£ìëë¤. ì¨ê²¨ì§ ë¹ì©ì´ë íë¦¬ë¯¸ì ë²ì ì´ ììµëë¤.',
    },
    {
      question: 'ê°ì¸ì ë³´ë ìì íê°ì?',
      answer:
        'ë¤, ì°ë¦¬ë ê°ì¸ì ë³´ë³´í¸ë²ì ìì í ì¤ìí©ëë¤. ë¹ì ì ì ë³´ë ìí¸íëì´ ë³´í¸ëë©°, ì 3ìì ê³µì íì§ ììµëë¤.',
    },
    {
      question: 'ì¼ë§ë ìì£¼ ì¤ìºí  ì ìëì?',
      answer:
        'ì¤ìºì ì í ìì´ ì¸ì ë ì§ ì¤íí  ì ììµëë¤. ìíë ë§í¼ ìì£¼ ì¤ìºíì¸ì.',
    },
    {
      question: 'íìê°ìì´ íìíê°ì?',
      answer:
        'ìëì¤, íìê°ì ìì´ ë°ë¡ ì¤ìºì ììí  ì ììµëë¤. ëìë³´ëë¥¼ ì¬ì©íë ¤ë©´ ì´ë©ì¼ë¡ ê°ìíì¸ì.',
    },
    {
      question: 'ì ì¶ì´ ë°ê²¬ëë©´ ì´ë»ê² ëëì?',
      answer:
        'ì°ë¦¬ê° PIPA ê¸°ë°ì ìëíë ì­ì  ìì²­ì ìì±í©ëë¤. ë¹ì ì ì´ë¥¼ í´ë¹ íì¬ì ë°ì¡íë© ë©ëë¤.',
    },
    {
      question: 'ì¼ë§ë ë¹ ë¥´ê² ì­ì ëëì?',
      answer:
        'ì­ì  ê¸°ê°ì ê°ì¸ì ë³´ë¥¼ ë³´ì í íì¬ì ë°ë¼ ë¤ë¦ëë¤. ì¼ë°ì ì¼ë¡ 30ì¼ ì´ë´ì ì²ë¦¬ë©ëë¤.',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-dark-bg py-20 px-4">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-20">
        <div className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
          <span className="text-sm text-primary font-medium">
            í¬ëªí ê°ê²© ì ì±
          </span>
        </div>

        <h1 className="text-5xl font-bold mb-6 gradient-text">
          ìì í ë¬´ë£ìëë¤
        </h1>

        <p className="text-xl text-gray-400 mb-8">
          ë¹ì ì ê°ì¸ì ë³´ë¥¼ ë³´í¸íë ê²ì ë¹ì ì ê¶ë¦¬ìëë¤.
          ì ì¶ë·ì»´ì ëª¨ë  ê¸°ë¥ì ìì í ë¬´ë£ë¡ ì ê³µí©ëë¤.
        </p>

        <div className="text-6xl font-bold mb-4">â©0</div>
        <p className="text-gray-400 mb-8">
          ì¨ê²¨ì§ ë¹ì©ì´ë íë¦¬ë¯¸ì ë²ì ì´ ììµëë¤.
        </p>

        <Link
          href="/scan"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-smooth text-lg"
        >
          <span>ì§ê¸ ììíê¸°</span>
          <Zap size={24} />
        </Link>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">
          ëª¨ë  ê¸°ë¥ì´ ë¬´ë£ë¡ ì ê³µë©ëë¤
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
          ì ì¶ë·ì»´ vs ë¤ë¥¸ ìë¹ì¤
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-dark-border">
          <table className="w-full text-sm">
            <thead className="bg-dark-card border-b border-dark-border">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">ê¸°ë¥</th>
                <th className="px-6 py-4 text-center font-semibold text-primary">
                  ì ì¶ë·ì»´
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-400">
                  ê²½ìì¬ A
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-400">
                  ê²½ìì¬ B
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-400">
                  ê²½ìì¬ C
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
                      <span className="text-gray-500">â</span>
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
                        <span className="text-gray-500">â</span>
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
            ì ì¶ë·ì»´ì íêµ­ì ìí´ í¹ë³í ì¤ê³ëììµëë¤
          </p>
          <p className="text-gray-400">
            ê°ì¸ì ë³´ë³´í¸ë²(PIPA)ì ìì í ì¤ìíë©°, íêµ­ì ê°ì¸ì ë³´ ì ì¶ì
            ìµì íëì´ ììµëë¤.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">
          ìì£¼ ë¬»ë ì§ë¬¸
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
                  â¼
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
          <h2 className="text-3xl font-bold mb-4">ì§ê¸ ììíì¸ì</h2>
          <p className="text-gray-400 text-lg mb-8">
            ë¹ì ì ê°ì¸ì ë³´ ë³´í¸ë¥¼ ìí´ ì§ê¸ ë°ë¡ ì¤ìºì ììíì¸ì.
            íìê°ìë íì ììµëë¤.
          </p>

          <Link
            href="/scan"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-smooth"
          >
            <Zap size={20} />
            <span>ë¬´ë£ ì¤ìº ìì</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
