# 🚨 은파미용실 웹사이트 배포 전 필수 체크리스트

> **작성일**: 2025-01-XX  
> **프로젝트**: 은파미용실 웹사이트  
> **배포 대상**: Vercel / Netlify (무료 플랜 기준)

---

## 📊 고수준 요약

### ⚠️ 발견된 치명적 위험 요소

1. **[치명적] 데이터베이스 설계 오류**
   - SQLite 사용 → Vercel/Netlify 프로덕션 환경에서 **작동 불가**
   - 파일 시스템이 읽기 전용이므로 SQLite DB 파일 쓰기 불가
   - **즉시 PostgreSQL/MySQL 등 클라우드 DB로 전환 필요**

2. **[치명적] 공개 API 엔드포인트 노출**
   - `GET /api/reservations` → 인증 없이 모든 예약 데이터 노출
   - 개인정보(이름, 전화번호, 이메일) 완전 노출
   - GDPR/개인정보보호법 위반 가능성

3. **[치명적] Rate Limiting 부재**
   - API 호출 제한 없음 → DDoS 공격 취약
   - 이메일 API 무제한 호출 가능 → **비용 폭증 위험**
   - 봇 트래픽으로 인한 서버리스 함수 비용 급증

4. **[치명적] 하드코딩된 민감 정보**
   - `send-email/route.ts:38` → 관리자 이메일 하드코딩
   - GitHub 공개 저장소에 노출 시 스팸/공격 대상

### ✅ 잘한 설계

- Resend API 키 검증 로직 존재
- 에러 핸들링 기본 구조 있음
- Next.js 15 최신 버전 사용
- TypeScript 사용

---

## 1️⃣ 보안 & 비용 안전성 (최우선)

### 🔴 치명적 위험 (배포 전 반드시 수정)

#### 1.1 데이터베이스 전환 (SQLite → PostgreSQL)

**현재 문제:**
```prisma
// prisma/schema.prisma
datasource db {
  provider = "sqlite"  // ❌ 프로덕션에서 작동 안 함
  url      = "file:./dev.db"
}
```

**해결 방법:**
1. **Vercel Postgres** (추천) 또는 **Supabase** (무료 플랜 제공)
2. Prisma schema 수정:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
3. 환경 변수 설정:
```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
```

**비용 리스크:** SQLite 사용 시 배포 자체가 실패 → 사이트 작동 불가

---

#### 1.2 GET /api/reservations 인증 추가

**현재 문제:**
```typescript
// api/reservations/route.ts:74-90
export async function GET() {
  // ❌ 인증 없이 모든 예약 데이터 노출
  const reservations = await prisma.reservation.findMany()
  return NextResponse.json(reservations)
}
```

**해결 방법:**

**옵션 A: Basic Auth (간단)**
```typescript
// api/reservations/route.ts
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expectedAuth = `Basic ${Buffer.from(
    `${process.env.ADMIN_USER}:${process.env.ADMIN_PASSWORD}`
  ).toString('base64')}`
  
  if (authHeader !== expectedAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // ... 기존 로직
}
```

**옵션 B: 환경 변수 기반 토큰 (추천)**
```typescript
export async function GET(request: NextRequest) {
  const token = request.headers.get('x-admin-token')
  if (token !== process.env.ADMIN_API_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ... 기존 로직
}
```

**옵션 C: Admin 페이지에서만 접근 (가장 안전)**
```typescript
// middleware.ts 생성
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/reservations')) {
    const token = request.headers.get('x-admin-token')
    if (token !== process.env.ADMIN_API_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/api/reservations',
}
```

**비용 리스크:** 개인정보 유출 → 법적 책임, 평판 손상

---

#### 1.3 Rate Limiting 구현

**현재 문제:**
- API 엔드포인트에 rate limiting 없음
- 봇이 무제한 호출 가능 → 서버리스 함수 비용 폭증

**해결 방법:**

**Vercel 사용 시:**
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10초에 10회
})
```

**Netlify 사용 시:**
```typescript
// lib/rate-limit.ts (간단한 메모리 기반)
const requestCounts = new Map<string, { count: number; resetAt: number }>()

export async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Date.now()
  const limit = 10 // 10회
  const window = 10 * 1000 // 10초
  
  const record = requestCounts.get(ip)
  
  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + window })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}
```

**API 라우트 적용:**
```typescript
// api/reservations/route.ts
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  
  if (!await checkRateLimit(ip)) {
    return NextResponse.json(
      { error: '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.' },
      { status: 429 }
    )
  }
  
  // ... 기존 로직
}
```

**비용 리스크:** 
- 봇이 1초에 1000회 호출 → 서버리스 함수 1000회 실행
- Vercel Pro: $0.36/100만 요청 → 하루에 수만 요청 시 수십 달러
- Resend API: 무료 플랜 100건/일 → 초과 시 과금

---

#### 1.4 이메일 API 비용 제한

**현재 문제:**
```typescript
// api/send-email/route.ts:36
// ❌ Rate limiting 없이 무제한 호출 가능
const { data, error } = await resend.emails.send({...})
```

**해결 방법:**
1. **Rate limiting 적용** (위 1.3 참조)
2. **일일 한도 설정:**
```typescript
// lib/email-quota.ts
const dailyEmailCount = new Map<string, number>()

export function checkDailyEmailLimit(): boolean {
  const today = new Date().toDateString()
  const count = dailyEmailCount.get(today) || 0
  
  if (count >= 50) { // 하루 50건 제한
    return false
  }
  
  dailyEmailCount.set(today, count + 1)
  return true
}
```

3. **환경 변수로 관리자 이메일 이동:**
```typescript
// ❌ 하드코딩
to: ['dlehddyd535@gmail.com'],

// ✅ 환경 변수
to: [process.env.ADMIN_EMAIL || ''],
```

**비용 리스크:**
- Resend 무료: 100건/일
- 초과 시: $0.30/1000건
- 봇 공격 시 하루에 수천 건 → 수십~수백 달러

---

#### 1.5 입력 검증 강화

**현재 문제:**
```typescript
// api/reservations/route.ts:12
if (!name || !phone || !date || !time) {
  // ❌ 길이, 형식 검증 없음
}
```

**해결 방법:**
```typescript
import { z } from 'zod' // npm install zod

const reservationSchema = z.object({
  name: z.string().min(2).max(50).regex(/^[가-힣a-zA-Z\s]+$/),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  service: z.string().max(100).optional(),
  message: z.string().max(500).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = reservationSchema.parse(body)
    // ... 기존 로직
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 형식이 올바르지 않습니다.' },
        { status: 400 }
      )
    }
  }
}
```

**비용 리스크:** 악의적 입력으로 DB 오염, 스토리지 비용 증가

---

### 🟡 높은 위험 (배포 전 수정 권장)

#### 1.6 CAPTCHA 또는 Honeypot 추가

**Honeypot (간단, 무료):**
```typescript
// Contact.tsx
const [honeypot, setHoneypot] = useState('')

// 폼에 숨겨진 필드 추가
<input
  type="text"
  name="website"
  value={honeypot}
  onChange={(e) => setHoneypot(e.target.value)}
  style={{ display: 'none' }}
  tabIndex={-1}
  autoComplete="off"
/>

// API에서 검증
if (body.website) {
  // 봇이 채웠음
  return NextResponse.json({ message: '성공' }, { status: 200 })
  // 실제로는 저장하지 않음
}
```

**Google reCAPTCHA v3 (추천):**
```bash
npm install react-google-recaptcha-v3
```

```typescript
// Contact.tsx
import { useReCaptcha } from 'react-google-recaptcha-v3'

const { executeRecaptcha } = useReCaptcha()

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const token = await executeRecaptcha('reservation')
  
  const response = await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...formData, recaptchaToken: token }),
  })
}
```

---

#### 1.7 CORS 설정

**현재 문제:** CORS 설정 없음 → CSRF 공격 가능

**해결 방법:**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGIN || 'https://yourdomain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'POST, GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ]
  },
}
```

---

#### 1.8 에러 메시지 정보 노출 최소화

**현재 문제:**
```typescript
// ❌ 스택 트레이스 노출 가능
console.error('예약 저장 중 오류:', error)
return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
```

**해결 방법:**
```typescript
// 프로덕션에서는 상세 에러 숨기기
const isProduction = process.env.NODE_ENV === 'production'

if (error instanceof Prisma.PrismaClientKnownRequestError) {
  console.error('DB 오류:', error)
  return NextResponse.json(
    { error: isProduction ? '서버 오류가 발생했습니다.' : error.message },
    { status: 500 }
  )
}
```

---

### 🟢 중간 위험 (운영 중 점진적 개선)

- HTTPS 강제 (Vercel/Netlify 기본 제공)
- Content Security Policy (CSP) 헤더 추가
- 환경 변수 검증 스크립트

---

## 2️⃣ 숙련 개발자 배포 전 체크리스트

### 개발 단계

- [ ] **환경 변수 검증 스크립트 작성**
```typescript
// scripts/check-env.ts
const required = ['DATABASE_URL', 'RESEND_API_KEY', 'ADMIN_EMAIL']
const missing = required.filter(key => !process.env[key])

if (missing.length > 0) {
  console.error('❌ 누락된 환경 변수:', missing)
  process.exit(1)
}
```

- [ ] **로컬에서 프로덕션 빌드 테스트**
```bash
npm run build
npm start
# 모든 페이지, API 엔드포인트 동작 확인
```

- [ ] **GitHub Secrets 설정 확인**
  - Vercel: Settings → Environment Variables
  - Netlify: Site settings → Environment variables

### 배포 단계

- [ ] **데이터베이스 마이그레이션**
```bash
npx prisma migrate deploy
npx prisma generate
```

- [ ] **환경 변수 일괄 설정**
  - `DATABASE_URL`
  - `RESEND_API_KEY`
  - `ADMIN_EMAIL`
  - `ADMIN_API_TOKEN` (새로 생성)
  - `NEXT_PUBLIC_BASE_URL`

- [ ] **GitHub 저장소 보안 점검**
  - [ ] `.env.local`이 `.gitignore`에 포함되어 있는지
  - [ ] 하드코딩된 API 키, 비밀번호 없음
  - [ ] `package.json`에 민감 정보 없음

### 배포 직후 (30분 내)

- [ ] **기본 동작 확인**
  - [ ] 홈페이지 로딩
  - [ ] 예약 폼 제출 테스트
  - [ ] Admin 페이지 접근 (인증 필요)
  - [ ] 이메일 수신 확인

- [ ] **에러 로그 모니터링**
  - Vercel: Dashboard → Functions → Logs
  - Netlify: Functions → Logs

- [ ] **비용 모니터링 설정**
  - Vercel: Usage 탭 확인
  - Resend: Dashboard → Usage 확인

### 운영 중 (첫 주)

- [ ] **일일 API 호출 수 모니터링**
- [ ] **이메일 전송 건수 확인**
- [ ] **데이터베이스 크기 모니터링**
- [ ] **응답 시간 확인** (3초 이내)

---

## 3️⃣ SEO & 검색 노출 최적화

### 🔴 필수 (배포 전)

#### 3.1 메타데이터 강화

**현재 문제:**
```typescript
// app/layout.tsx:16
export const metadata: Metadata = {
  title: "Beauty Salon - 당신의 아름다움을 완성하는 곳",
  description: "전문적인 기술과 따뜻한 마음으로 당신만의 특별한 스타일을 만들어드립니다",
  // ❌ Open Graph, Twitter Card 없음
}
```

**해결 방법:**
```typescript
export const metadata: Metadata = {
  title: "은파미용실 - 상주시 전문 헤어살롱",
  description: "경상북도 상주시 남성동 위치. 커트, 펌, 염색, 헤어 케어 전문. 온라인 예약 가능.",
  keywords: "은파미용실, 상주 미용실, 상주 헤어살롱, 남성동 미용실",
  openGraph: {
    title: "은파미용실 - 상주시 전문 헤어살롱",
    description: "경상북도 상주시 남성동 위치. 온라인 예약 가능.",
    url: "https://yourdomain.com",
    siteName: "은파미용실",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "은파미용실 - 상주시 전문 헤어살롱",
    description: "경상북도 상주시 남성동 위치. 온라인 예약 가능.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://yourdomain.com",
  },
}
```

---

#### 3.2 robots.txt 생성

**파일 생성:**
```txt
# public/robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin

Sitemap: https://yourdomain.com/sitemap.xml
```

---

#### 3.3 sitemap.xml 생성

**파일 생성:**
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/#services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]
}
```

---

#### 3.4 구조화 데이터 (Schema.org)

**로컬 비즈니스 스키마 추가:**
```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: '은파미용실',
    image: 'https://yourdomain.com/logo.jpg',
    '@id': 'https://yourdomain.com',
    url: 'https://yourdomain.com',
    telephone: '054-535-6353',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '경상북도 상주시 남성동 101-29번지',
      addressLocality: '상주시',
      addressRegion: '경상북도',
      addressCountry: 'KR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 36.4121609,
      longitude: 128.1621865,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      opens: '09:00',
      closes: '19:00',
    },
  }

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

#### 3.5 NAP 일관성

**확인 사항:**
- [ ] 모든 페이지에서 이름/주소/전화번호 동일
- [ ] Google My Business와 일치
- [ ] Footer에 주소 포함

---

### 🟡 권장 (배포 후 1주일 내)

- Google Search Console 등록
- Google My Business 등록/연동
- Lighthouse 점수 90+ 달성
- 모바일 친화성 테스트

---

## 4️⃣ 버그 & 안정성 코드 점검

### 🔴 치명적 버그 (배포 전 수정)

#### 4.1 Prisma 클라이언트 프로덕션 설정

**현재 문제:**
```typescript
// lib/prisma.ts
// ❌ 프로덕션에서 연결 풀 관리 부족
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
```

**해결 방법:**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// 프로덕션에서 연결 종료 처리
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}
```

---

#### 4.2 타임아웃 설정

**API 라우트에 타임아웃 추가:**
```typescript
// api/reservations/route.ts
export const maxDuration = 10 // Vercel 기본 10초, 최대 300초

export async function POST(request: NextRequest) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000) // 8초 타임아웃
  
  try {
    // ... 기존 로직
  } finally {
    clearTimeout(timeout)
  }
}
```

---

#### 4.3 네트워크 실패 처리

**프론트엔드 에러 핸들링 강화:**
```typescript
// Contact.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  
  try {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      signal: AbortSignal.timeout(10000), // 10초 타임아웃
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '요청 실패')
    }
    
    setSubmitStatus('success')
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        setSubmitStatus('error')
        // 타임아웃 메시지 표시
      } else {
        setSubmitStatus('error')
      }
    }
  } finally {
    setIsSubmitting(false)
  }
}
```

---

### 🟡 높은 위험 (배포 전 수정 권장)

#### 4.4 이미지 최적화

**현재:** `next.config.ts`에서 `unoptimized: true` 설정
- Vercel/Netlify는 Next.js Image 최적화 지원
- `unoptimized: true` 제거 권장

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    // unoptimized: true 제거
    domains: ['yourdomain.com'], // 외부 이미지 도메인 추가
  },
}
```

---

#### 4.5 접근성 (a11y) 개선

**현재 문제:**
- 버튼에 `aria-label` 없음
- 폼 에러 메시지에 `aria-live` 없음

**해결 방법:**
```typescript
// Contact.tsx
<button
  type="submit"
  disabled={isSubmitting}
  aria-label={isSubmitting ? '제출 중...' : '예약 제출'}
  aria-busy={isSubmitting}
>
  {isSubmitting ? t.contact.submitting : t.contact.submit}
</button>

{submitStatus === 'error' && (
  <div
    role="alert"
    aria-live="polite"
    className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
  >
    {t.contact.errorMessage}
  </div>
)}
```

---

### 🟢 중간 위험 (운영 중 개선)

- 폰트 로딩 최적화 (현재 Google Fonts 사용 중)
- 로딩 스켈레톤 추가
- 오프라인 지원 (Service Worker)

---

## 5️⃣ 절대 하지 말아야 할 구현

### ❌ 안티패턴 목록

1. **환경 변수를 클라이언트 컴포넌트에서 직접 사용**
   ```typescript
   // ❌ 절대 하지 말 것
   const apiKey = process.env.RESEND_API_KEY
   
   // ✅ 서버 컴포넌트 또는 API 라우트에서만 사용
   ```

2. **API 키를 프론트엔드에 노출**
   ```typescript
   // ❌ 절대 하지 말 것
   const response = await fetch('https://api.example.com', {
     headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
   })
   ```

3. **무제한 재시도 로직**
   ```typescript
   // ❌ 절대 하지 말 것
   while (true) {
     await sendEmail()
   }
   ```

4. **에러를 무시하고 계속 진행**
   ```typescript
   // ❌ 절대 하지 말 것
   try {
     await sendEmail()
   } catch (e) {
     // 아무것도 안 함
   }
   ```

5. **개발용 설정을 프로덕션에 사용**
   ```typescript
   // ❌ 절대 하지 말 것
   if (process.env.NODE_ENV === 'development') {
     // 이 로직이 프로덕션에서 실행되면 안 됨
   }
   // 대신 명시적으로 프로덕션 체크
   if (process.env.NODE_ENV === 'production') {
     // 프로덕션 전용 로직
   }
   ```

---

## 6️⃣ 최종 배포 승인 기준 (GO/NO-GO)

### ✅ GO 조건 (모두 충족 시 배포 가능)

#### 보안
- [ ] SQLite → PostgreSQL 전환 완료
- [ ] GET /api/reservations 인증 추가
- [ ] Rate limiting 구현
- [ ] 하드코딩된 이메일 주소 제거
- [ ] 환경 변수 모두 설정됨

#### 비용 안전성
- [ ] 이메일 API 일일 한도 설정
- [ ] Rate limiting으로 API 호출 제한
- [ ] 모니터링 대시보드 설정

#### SEO
- [ ] robots.txt 생성
- [ ] sitemap.xml 생성
- [ ] 메타데이터 강화 (OG 태그 포함)
- [ ] 구조화 데이터 추가

#### 안정성
- [ ] 프로덕션 빌드 성공
- [ ] 모든 API 엔드포인트 테스트 통과
- [ ] 에러 핸들링 검증
- [ ] 타임아웃 설정

### ❌ NO-GO 조건 (하나라도 해당 시 배포 중단)

- [ ] SQLite 사용 중
- [ ] 인증 없는 공개 API 엔드포인트 존재
- [ ] Rate limiting 없음
- [ ] 환경 변수 누락
- [ ] 하드코딩된 API 키/비밀번호 존재
- [ ] 프로덕션 빌드 실패

---

## 7️⃣ 배포 후 모니터링 체크리스트

### 첫 24시간

- [ ] API 호출 수 확인 (비정상적 증가 없음)
- [ ] 에러 로그 확인
- [ ] 이메일 전송 건수 확인
- [ ] 데이터베이스 연결 상태 확인
- [ ] 응답 시간 모니터링 (< 3초)

### 첫 주

- [ ] Google Search Console 등록 및 인덱싱 확인
- [ ] Lighthouse 점수 확인 (90+)
- [ ] 모바일 사용성 테스트
- [ ] 실제 예약 접수 테스트

### 첫 달

- [ ] 비용 청구서 확인 (예상 범위 내)
- [ ] 사용자 피드백 수집
- [ ] SEO 순위 모니터링
- [ ] 보안 취약점 스캔

---

## 8️⃣ 긴급 대응 가이드

### 비용 폭증 발생 시

1. **즉시 조치:**
   - Vercel/Netlify 대시보드에서 함수 실행 중지
   - Resend API 키 비활성화
   - Rate limiting 값 긴급 조정

2. **원인 파악:**
   - 로그에서 공격 IP 확인
   - API 호출 패턴 분석

3. **복구:**
   - IP 차단 (Vercel/Netlify 방화벽)
   - Rate limiting 강화
   - CAPTCHA 추가

### 데이터 유출 의심 시

1. **즉시 조치:**
   - API 엔드포인트 임시 비활성화
   - Admin 토큰 재생성
   - 데이터베이스 접근 로그 확인

2. **복구:**
   - 인증 강화
   - 감사 로그 추가

---

## 📝 체크리스트 요약

### 배포 전 필수 (치명적)
1. ✅ SQLite → PostgreSQL 전환
2. ✅ GET /api/reservations 인증 추가
3. ✅ Rate limiting 구현
4. ✅ 하드코딩된 이메일 제거
5. ✅ 입력 검증 강화 (Zod)

### 배포 전 권장 (높은 위험)
6. ✅ CAPTCHA/Honeypot 추가
7. ✅ CORS 설정
8. ✅ 에러 메시지 최소화

### 배포 전 SEO 필수
9. ✅ robots.txt 생성
10. ✅ sitemap.xml 생성
11. ✅ 메타데이터 강화
12. ✅ 구조화 데이터 추가

### 배포 후 모니터링
13. ✅ 비용 모니터링 설정
14. ✅ 에러 로그 모니터링
15. ✅ Google Search Console 등록

---

**작성자**: AI Assistant  
**최종 업데이트**: 2025-01-XX  
**다음 검토 예정일**: 배포 후 1주일

