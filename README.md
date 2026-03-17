<div align="center">

<img src="https://img.shields.io/badge/%F0%9F%9B%A1%EF%B8%8F_%EC%9C%A0%EC%B6%9C%EB%8B%B7%EC%BB%B4-7c3aed?style=for-the-badge&labelColor=0a0a0f&logoColor=white" alt="유출닷컴" height="40"/>

# 유출닷컴 — yuchul.com

**내 개인정보, 어디까지 유출됐을까?**

다크웹 · 검색엔진 · 데이터브로커 — 유출 확인부터 삭제 대응까지

[![Live](https://img.shields.io/badge/🌐_Live-yuchul.com-7c3aed?style=for-the-badge)](https://yuchul.com)
[![Deploy](https://img.shields.io/badge/Vercel-Deployed-000?style=for-the-badge&logo=vercel)](https://vercel.com)

<br/>

[![Next.js 15](https://img.shields.io/badge/Next.js-15-000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State-443E38?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![100% Free](https://img.shields.io/badge/💰_Cost-$0/mo-22c55e?style=flat-square)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](https://github.com/memekr/yuchul-com/pulls)

</div>

<br/>

<div align="center">
<table>
<tr>
<td align="center"><b>🕷️ 다크웹 스캔</b><br/><sub>HIBP k-anonymity API</sub></td>
<td align="center"><b>🔍 검색엔진 노출</b><br/><sub>Naver · Daum · Google</sub></td>
<td align="center"><b>🤖 자동 삭제 요청</b><br/><sub>PIPA 제36조 기반</sub></td>
<td align="center"><b>📊 실시간 대시보드</b><br/><sub>위험 점수 · 알림</sub></td>
</tr>
</table>
</div>

---

## 왜 유출닷컴인가?

매년 수천만 건의 개인정보가 유출되지만, 대부분의 사람들은 자신의 정보가 어디에 노출되어 있는지조차 모릅니다. **유출닷컴**은 이메일 하나만 입력하면 다크웹, 검색엔진, 데이터브로커에 퍼져 있는 개인정보를 찾아내고, 한국 개인정보보호법(PIPA)에 근거하여 자동으로 삭제 요청까지 처리합니다.

**이 모든 것이 완전 무료이고, 오픈소스입니다.**

---

## 핵심 기능

### 🕷️ 다크웹 유출 스캔
Have I Been Pwned(HIBP) k-anonymity API를 활용하여 다크웹에 유출된 이메일, 비밀번호, 개인정보를 실시간으로 탐지합니다. 비밀번호 원문이 서버에 전송되지 않는 k-anonymity 방식을 사용합니다.

### 🔍 검색엔진 노출 감지
네이버, 다음, 구글 검색 결과에 노출된 개인정보를 스캔합니다. 주민등록번호, 연락처, 주소 등 민감 정보의 공개 노출을 확인합니다.

### 🤖 데이터브로커 자동 삭제
인물정보 사이트, 주소록 수집 사이트 등에 등록된 정보를 탐지하고, 개인정보보호법 제36조(삭제요구권)에 근거하여 자동 삭제 요청을 발송합니다.

### 📊 실시간 대시보드
위험 점수(0–100), 유출 현황, 삭제 진행 상태를 한눈에 파악할 수 있는 대시보드를 제공합니다.

### 🔔 알림 시스템
새로운 유출이 발견되면 웹 푸시 알림으로 즉시 통보합니다.

### 📄 법적 대응 템플릿
PIPA 기반 삭제 요청서, 정보통신망법 근거 항의서 등 한국 법률에 최적화된 템플릿을 자동 생성합니다.

---

## 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                       │
│  Next.js 15 App Router + React 19 + Tailwind CSS + Zustand  │
└────────────────────────┬────────────────────────────────────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
     ┌──────────┐ ┌───────────┐ ┌──────────────┐
     │ Supabase │ │ HIBP API  │ │ Resend Email │
     │ Auth+DB  │ │ k-anon    │ │ (삭제 요청)   │
     └──────────┘ └───────────┘ └──────────────┘
     Google OAuth   유출 탐지      법적 대응
     PostgreSQL     비밀번호 체크   자동 발송
```

---

## 기술 스택

| 영역 | 기술 | 비용 |
|------|------|:----:|
| **프론트엔드** | Next.js 15 + React 19 + TypeScript | $0 |
| **스타일링** | Tailwind CSS 3 + 다크 테마 | $0 |
| **상태관리** | Zustand 4 | $0 |
| **백엔드/DB** | Supabase (PostgreSQL + Auth + RLS) | Free Tier |
| **유출 탐지** | HIBP k-anonymity API | 무료 |
| **이메일** | Resend (삭제 요청 발송) | Free 100/일 |
| **인증** | Google OAuth 2.0 (via Supabase) | $0 |
| **호스팅** | Vercel (Edge Network) | Free Tier |
| **월 총 비용** | | **$0** |

---

## 빠른 시작

```bash
# 1. 클론
git clone https://github.com/memekr/yuchul-com.git
cd yuchul-com

# 2. 의존성 설치
npm install

# 3. 환경변수 설정
cp .env.example .env.local
# .env.local에 Supabase URL/Key 입력

# 4. 개발 서버 실행
npm run dev
```

`http://localhost:3000` 에서 확인

---

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                # 랜딩 페이지
│   ├── scan/page.tsx           # 보안 스캔
│   ├── pricing/page.tsx        # 요금 안내 (전체 무료)
│   ├── auth/
│   │   ├── login/page.tsx      # Google OAuth 로그인
│   │   ├── signup/page.tsx     # 회원가입
│   │   └── callback/route.ts   # OAuth 콜백 처리
│   ├── dashboard/
│   │   ├── page.tsx            # 대시보드 메인
│   │   ├── findings/page.tsx   # 유출 발견 항목
│   │   ├── removal/page.tsx    # 삭제 요청 큐
│   │   ├── report/page.tsx     # 상세 리포트
│   │   └── settings/page.tsx   # 설정
│   └── api/
│       ├── scan/route.ts       # HIBP API 래퍼
│       └── removal/route.ts    # 삭제 요청 처리
├── components/
│   ├── Navbar.tsx              # 네비게이션 바
│   ├── Footer.tsx              # 푸터
│   ├── ScanForm.tsx            # 스캔 입력 폼
│   ├── RiskGauge.tsx           # 위험도 게이지
│   ├── FindingCard.tsx         # 유출 항목 카드
│   ├── DashboardLayout.tsx     # 대시보드 레이아웃
│   └── OpenSourceBadge.tsx     # 오픈소스 뱃지
└── lib/
    ├── types.ts                # TypeScript 타입 정의
    ├── store.ts                # Zustand 상태 관리
    ├── supabase.ts             # Supabase 클라이언트
    ├── hibp.ts                 # HIBP API 유틸
    └── removal-templates.ts    # 법적 삭제 요청 템플릿
```

---

## 한국 특화 기능

- **개인정보보호법(PIPA)** 기반 삭제 요청 자동 생성
- **네이버/다음** 검색엔진 노출 탐지
- **KISA(한국인터넷진흥원)** 유출 DB 연동 준비
- 한국어 UI 전체 지원
- 한국 데이터브로커 목록 내장

---

## 환경 변수

```env
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend (선택 — 이메일 삭제 요청 발송용)
RESEND_API_KEY=your_resend_api_key
```

---

## 로드맵

- [x] 다크웹 유출 스캔 (HIBP)
- [x] Google OAuth 로그인
- [x] 실시간 대시보드
- [x] PIPA 삭제 요청 템플릿
- [x] Vercel + 커스텀 도메인 배포
- [ ] 실시간 웹소켓 알림
- [ ] 이메일 자동 발송 (Resend)
- [ ] KISA 유출 DB 연동
- [ ] 모바일 앱 (React Native)
- [ ] AI 기반 보안 제안

---

## 기여하기

PR과 이슈 환영합니다! 개인정보 보호는 모두의 권리입니다.

```bash
git checkout -b feature/awesome-feature
git commit -m "Add awesome feature"
git push origin feature/awesome-feature
```

---

## 라이선스

[MIT License](LICENSE) — 자유롭게 사용, 수정, 배포하세요.

---

<div align="center">

**🛡️ 당신의 개인정보를 지키세요.**

[yuchul.com](https://yuchul.com) · [이슈 제출](https://github.com/memekr/yuchul-com/issues)

<sub>Made with ❤️ for Korean privacy protection</sub>

</div>
