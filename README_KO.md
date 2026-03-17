# ì ì¶ë·ì»´(ì ì¶ë·ì»´.com) - íêµ­ ê°ì¸ì ë³´ ì ì¶ íì¸ ìë¹ì¤

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3-38b2ac?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

ê°ì¸ì ë³´ ì ì¶ íì¸, ìë ì­ì  ìì²­, ì¤ìê° ìë¦¼ì ì ê³µíë **ìì  ë¬´ë£**ì íêµ­ ê°ì¸ì ë³´ ë³´í¸ ìë¹ì¤ìëë¤.

## ð¯ ëª©í

- íêµ­ì¸ì ê°ì¸ì ë³´ ë³´í¸
- ë¬´ë£ë¡ ì ê³µëë í¬ê´ì ì¸ ë³´ì ëêµ¬
- PIPA(ê°ì¸ì ë³´ë³´í¸ë²) ìì  ì¤ì
- ì¬ì©íê¸° ì¬ì´ UI/UX

## ð ì£¼ì ê¸°ë¥

### 1. ê°ì¸ì ë³´ ì ì¶ íì¸
- **ë¤í¬ì¹ ì¤ìº**: ìë ¤ì§ ëê·ëª¨ ë°ì´í° ì ì¶ìì ì ë³´ íì¸
- **ê²ììì§ ë¸ì¶ íì¸**: Google, Naver ë±ì ë¸ì¶ë ê°ì¸ì ë³´ ë°ê²¬
- **ë°ì´í°ë¸ë¡ì»¤ ê²ì¬**: ê°ì¸ì ë³´ íë§¤ ì¬ì´í¸ ëª¨ëí°ë§

### 2. ìë ì­ì  ìì²­
- PIPA ê¸°ë° ìëíë ì´ë©ì¼ ííë¦¿ ìì±
- íêµ­ ë°ì´í° ì»¨í¸ë¡¤ë¬ì ë§ì¶¤í ìì²­
- ì­ì  ì§íë¥  ì¶ì 

### 3. ëìë³´ë
- ìíë ì ì (0-100)
- ë°ê²¬ë ì ì¶ ê´ë¦¬
- ì­ì  ìì²­ ìí ì¶ì 
- ìê° ë³´ì ë¦¬í¬í¸

### 4. ìë¦¼ ê¸°ë¥
- ìë¡ì´ ì ì¶ ë°ê²¬ ì ì¦ì ìë¦¼
- ì­ì  ìí ìë°ì´í¸ ìë¦¼
- ì£¼ê° ë³´ì ë¦¬í¬í¸

## ð» ê¸°ì  ì¤í

### Frontend
- **íë ììí¬**: Next.js 15 (App Router)
- **UI**: React 19
- **ì¤íì¼ë§**: Tailwind CSS 3.3
- **ìí ê´ë¦¬**: Zustand
- **ìì´ì½**: Lucide React
- **ì¸ì´**: TypeScript

### ì¤ê³
- **íë§**: ë¤í¬ ëª¨ë (ê°ì¸ì ë³´ ë³´í¸ ê°ì¡°)
- **ë°ìí**: Mobile-First ëìì¸
- **ì ê·¼ì±**: WCAG 2.1 ì¤ì
- **ì±ë¥**: ìë ì½ë ì¤íë¦¬í, ì´ë¯¸ì§ ìµì í

### ì íì¬í­
- **ë°±ìë**: Supabase (Firebase ëì²´)
- **API**: Have I Been Pwned (HIBP)
- **ì¸ì¦**: Google, Kakao OAuth

## ð íë¡ì í¸ êµ¬ì¡°

```
yuchul-com/
âââ src/
â   âââ app/                          # Next.js App Router
â   â   âââ page.tsx                 # ííì´ì§
â   â   âââ layout.tsx               # ë£¨í¸ ë ì´ìì
â   â   âââ globals.css              # ì ì­ ì¤íì¼
â   â   âââ scan/page.tsx            # ì¤ìº íì´ì§
â   â   âââ pricing/page.tsx         # ê°ê²© íì´ì§
â   â   âââ dashboard/               # ëìë³´ë
â   â   â   âââ page.tsx            # ê°ì
â   â   â   âââ findings/page.tsx    # ì ì¶ íí©
â   â   â   âââ removal/page.tsx     # ì­ì  ìì²­
â   â   â   âââ report/page.tsx      # ìê° ë¦¬í¬í¸
â   â   â   âââ settings/page.tsx    # ì¤ì 
â   â   âââ auth/                    # ì¸ì¦
â   â   â   âââ login/page.tsx      # ë¡ê·¸ì¸
â   â   â   âââ signup/page.tsx     # íìê°ì
â   â   âââ api/                     # API ë¼ì°í¸
â   â       âââ scan/route.ts       # ì¤ìº API
â   â       âââ removal/route.ts    # ì­ì  API
â   âââ components/                  # React ì»´í¬ëí¸
â   â   âââ Navbar.tsx
â   â   âââ Footer.tsx
â   â   âââ ScanForm.tsx
â   â   âââ RiskGauge.tsx
â   â   âââ FindingCard.tsx
â   â   âââ DashboardLayout.tsx
â   âââ lib/                         # ì í¸ë¦¬í°
â       âââ types.ts                # TypeScript íì
â       âââ store.ts                # Zustand ì ì¥ì
â       âââ supabase.ts             # Supabase ì¤ì 
â       âââ hibp.ts                 # HIBP API
â       âââ removal-templates.ts    # ì´ë©ì¼ ííë¦¿
âââ package.json
âââ tsconfig.json
âââ next.config.ts
âââ tailwind.config.ts
âââ postcss.config.mjs
âââ .env.example
```

## ð¨ ìì ìì¤í

```
ë°°ê²½: #0a0a0f (ì´ëì´ ë¤ì´ë¹)
ì¹´ë: #1a1a2e (ì§ì ë³´ë¼)
íëë¦¬: #2d2d44 (íì)
ê°ì¡°: #6c5ce7 (ë³´ë¼ì)
ì±ê³µ: #00b894 (ì´ë¡ì)
ìí: #e17055 (ë¹¨ê°ì)
ê²½ê³ : #fdcb6e (ë¸ëì)
```

## ð ììíê¸°

### íì ì¡°ê±´
- Node.js 18+
- npm ëë yarn

### ì¤ì¹

```bash
# íë¡ì í¸ ë³µì 
git clone https://github.com/yourusername/yuchul-com.git
cd yuchul-com

# ìì¡´ì± ì¤ì¹
npm install
```

### ê°ë° ìë² ì¤í

```bash
npm run dev
```

ë¸ë¼ì°ì ìì `http://localhost:3000` ì´ê¸°

### íë¡ëì ë¹ë

```bash
npm run build
npm run start
```

## ð ë¬¸ì

ìì¸í ì¤ì  ë° ë°°í¬ ë°©ë²ì [SETUP.md](./SETUP.md)ë¥¼ ì°¸ê³ íì¸ì.

## ð ë°°í¬

### Vercel (ê¶ì¥)

```bash
npm i -g vercel
vercel
```

### íê²½ ë³ì

`.env.example`ì ì°¸ê³ íì¬ `.env.local` ìì±:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## ð± ì£¼ì íì´ì§

| íì´ì§ | URL | ì¤ëª |
|--------|-----|------|
| í | `/` | ëë© íì´ì§, ì¤ìº í¼ |
| ì¤ìº | `/scan` | ìì¸ ì¤ìº ë° ê²°ê³¼ |
| ëìë³´ë | `/dashboard` | ë³´ì íí© ê°ì |
| ì ì¶ íí© | `/dashboard/findings` | ë°ê²¬ë ëª¨ë  ì ì¶ |
| ì­ì  ìì²­ | `/dashboard/removal` | PIPA ííë¦¿ ê´ë¦¬ |
| ìê° ë¦¬í¬í¸ | `/dashboard/report` | ë³´ì íµê³ ë° ì°¨í¸ |
| ì¤ì  | `/dashboard/settings` | ìë¦¼, ê³ì  ì¤ì  |
| ê°ê²© | `/pricing` | ë¬´ë£ ê¸°ë¥ ì¤ëª, FAQ |
| ë¡ê·¸ì¸ | `/auth/login` | ë¡ê·¸ì¸ |
| íìê°ì | `/auth/signup` | íìê°ì |

## ð ë³´ì ë° ê°ì¸ì ë³´ ë³´í¸

- PIPA(ê°ì¸ì ë³´ë³´í¸ë²) ìì  ì¤ì
- ëª¨ë  ë°ì´í° ìí¸í
- ì 3ì ì ë³´ ê³µì  ê¸ì§
- ì ê¸°ì ì¸ ë³´ì ê°ì
- í¬ëªí ê°ì¸ì ë³´ ì²ë¦¬ ë°©ì¹¨

## ð¤ ê¸°ì¬

ë²ê·¸ ë¦¬í¬í¸ì ê¸°ë¥ ì ìì íìí©ëë¤!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ð ë¼ì´ì ì¤

MIT License - [LICENSE](LICENSE) íì¼ ì°¸ê³ 

## ð ë¬¸ì

GitHub Issuesë¥¼ íµí´ ë²ê·¸ ë¦¬í¬í¸ ë° ê¸°ë¥ ì ìì í  ì ììµëë¤: [ì´ì ì ì¶](https://github.com/yourusername/yuchul-com/issues)

## ð ê°ì¬ì ë§

- Have I Been Pwned (HIBP)
- Pretendard í°í¸
- Tailwind CSS ì»¤ë®¤ëí°

## ðºï¸ ë¡ëë§µ

- [ ] Supabase í íµí©
- [ ] ì¤ìê° ìë¦¼ (ì¹ìì¼)
- [ ] ì¤ì  HIBP API íµí©
- [ ] ì´ë©ì¼ ìë ë°ì¡
- [ ] ëª¨ë°ì¼ ì± (React Native)
- [ ] AI ê¸°ë° ë³´ì ì ì
- [ ] ë¤êµ­ì´ ì§ì

---

**ð ì´ íë¡ì í¸ë¥¼ ì¢ìíìë©´ Starë¥¼ ëë¬ì£¼ì¸ì!**

**ë¹ì ì ê°ì¸ì ë³´ ë³´í´ë ë¹ì ì ê¶ë¦¬ìëë¤.**
