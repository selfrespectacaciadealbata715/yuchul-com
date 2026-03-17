# ì ì¶ë·ì»´(Yuchul) - ì¤ì  ê°ì´ë

íêµ­ ê°ì¸ì ë³´ ì ì¶ íì¸ ë° ê°ì¸ì ë³´ ë³´í¸ ìë¹ì¤

## ê°ë° íê²½ ì¤ì 

### 1. ì¤ì¹

```bash
# íë¡ì í¸ ëë í ë¦¬ë¡ ì´ë
cd yuchul-com

# ìì¡´ì± ì¤ì¹
npm install
# ëë
yarn install
```

### 2. íê²½ ë³ì ì¤ì 

`.env.example`ì ë³µì¬íì¬ `.env.local` íì¼ì ìì±í©ëë¤:

```bash
cp .env.example .env.local
```

íìí íê²½ ë³ìë¥¼ ìë ¥í©ëë¤:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. ê°ë° ìë² ì¤í

```bash
npm run dev
# ëë
yarn dev
```

ë¸ë¼ì°ì ìì `http://localhost:3000`ì¼ë¡ ì ìí©ëë¤.

## êµ¬ì¡°

```
src/
âââ app/                          # Next.js App Router
â   âââ layout.tsx               # ë£¨í¸ ë ì´ìì
â   âââ page.tsx                 # ííì´ì§
â   âââ globals.css              # ì ì­ ì¤íì¼
â   âââ scan/                    # ì¤ìº íì´ì§
â   âââ dashboard/               # ëìë³´ë
â   â   âââ page.tsx            # ëìë³´ë ê°ì
â   â   âââ findings/           # ì ì¶ íí©
â   â   âââ removal/            # ì­ì  ìì²­
â   â   âââ report/             # ìê° ë¦¬í¬í¸
â   â   âââ settings/           # ì¤ì 
â   âââ pricing/                 # ê°ê²© íì´ì§
â   âââ auth/                    # ì¸ì¦
â   â   âââ login/              # ë¡ê·¸ì¸
â   â   âââ signup/             # íìê°ì
â   âââ api/                     # API ë¼ì°í¸
â       âââ scan/               # ì¤ìº API
â       âââ removal/            # ì­ì  ìì²­ API
âââ components/                  # React ì»´í¬ëí¸
â   âââ Navbar.tsx              # ë¤ë¹ê²ì´ì
â   âââ Footer.tsx              # í¸í°
â   âââ ScanForm.tsx            # ì¤ìº ìë ¥ í¼
â   âââ RiskGauge.tsx           # ìíë ê²ì´ì§
â   âââ FindingCard.tsx         # ì ì¶ ì¹´ë
â   âââ DashboardLayout.tsx     # ëìë³´ë ë ì´ìì
âââ lib/                         # ì í¼ë¦¬í°
    âââ types.ts                # TypeScript íì
    âââ store.ts                # Zustand ìí ê´ë¦¬
    âââ supabase.ts             # Supabase í´ë¼ì´ì¸í¸
    âââ hibp.ts                 # Have I Been Pwned API
    âââ removal-templates.ts    # PIPA ííë¦¿
```

## ì£¼ì ê¸°ë¥

### 1. ê°ì¸ì ë³´ ì ì¶ íì¸
- ë¤í¬ì¹ ì ì¶ ì¤ìº
- ê²ììì§ ë¸ì¶ íì¸
- ë°ì´í°ë¸ë¡ì»¤ ê²ì¬

### 2. ìë ì­ì  ìì²­
- PIPA(ê°ì¸ì ë³´ë³´í¸ë²) ê¸°ë° ííë¦¿
- ìëíë ì´ë©ì¼ ìì±
- ì­ì  ìì²­ ì¶ì 

### 3. ëìë³´ë
- ìíë ì ì
- ì¤ìº ê²°ê³¼
- ì­ì  ìì²­ ê´ë¦¬
- ìê° ë¦¬í¬í¸

### 4. ìë¦¼ ê¸°ë¥
- ì´ë©ì¼ ìë¦¼
- ì¹ í¸ì ìë¦¼
- ì£¼ê° ë¦¬í¬í¸

## ê¸°ì  ì¤í

- **Framework**: Next.js 15
- **React**: React 19
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Backend**: Supabase (ì íì¬í­)
- **API Integration**: Have I Been Pwned (HIBP)

## ë°°í¬

### Vercel ë°°í¬

```bash
# Vercel CLI ì¤ì¹
npm i -g vercel

# ë°°í¬
vercel
```

íê²½ ë³ìë¥¼ Vercel íë¡ì í¸ ì¤ì ìì êµ¬ì±í©ëë¤.

## API ìëí¬ì¸í¸

### POST /api/scan
ê°ì¸ì ë³´ ì ì¶ ì¤ìºì ììí©ëë¤.

**ìì²­:**
```json
{
  "email": "example@gmail.com",
  "phone": "010-1234-5678",
  "name": "íê¸¸ë",
  "username": "username123"
}
```

**ìëµ:**
```json
{
  "success": true,
  "findings": [...],
  "riskScore": 72
}
```

### POST /api/removal
PIPA ê¸°ë° ì­ì  ìì²­ì ìì±í©ëë¤.

**ìì²­:**
```json
{
  "dataController": "íì¬ëª",
  "userData": {
    "name": "íê¸¸ë",
    "email": "example@gmail.com"
  },
  "dataTypes": ["ì´ë©ì¼", "ì´ë¦"],
  "region": "korea"
}
```

## ê¸°ì¬

ë²ê·¸ ë¦¬í¬í¸ì ê¸°ë¥ ì ìì íìí©ëë¤.

## ë¼ì´ì ì¤

MIT License

## ë¬¸ì

GitHub Issuesë¥¼ íµí´ ë¬¸ìíì¸ì: [ì´ì ì ì¶](https://github.com/yourusername/yuchul-com/issues)
