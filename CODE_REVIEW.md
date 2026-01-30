# 코드 검토 보고서

## 고수준 요약

### 좋은 점
- ✅ TypeScript 사용으로 타입 안정성 확보
- ✅ Prisma ORM으로 SQL injection 방지
- ✅ 다국어 지원 구조가 잘 설계됨
- ✅ 컴포넌트 구조가 명확하고 분리되어 있음
- ✅ 에러 핸들링 기본 구조 존재

### 위험한 점
- 🔴 **P0**: Admin 페이지에 인증 없음 - 모든 예약 데이터 노출 위험
- 🔴 **P0**: GET /api/reservations에 인증 없음 - 공개 API로 모든 예약 조회 가능
- 🟡 **P1**: 입력 검증 부족 - XSS, 데이터 무결성 문제 가능
- 🟡 **P1**: 하드코딩된 민감 정보 (이메일, URL)
- 🟡 **P1**: 이메일 전송 실패 시 재시도 로직 없음
- 🟢 **P2**: SSR/CSR 하이드레이션 불일치 가능성 (localStorage 사용)

---

## 구체적인 문제점

### P0 - 보안: Admin 페이지 인증 없음
**파일**: `src/app/admin/page.tsx`  
**라인**: 전체  
**영향**: 높음

```typescript
// 현재: 누구나 /admin 접근 가능
export default function AdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  // 인증 체크 없음
```

**수정안**:
```typescript
// middleware.ts 또는 admin/page.tsx에서
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await getServerSession()
  if (!session || !session.isAdmin) {
    redirect('/login')
  }
  // ...
}
```

---

### P0 - 보안: 공개 API 엔드포인트
**파일**: `src/app/api/reservations/route.ts`  
**라인**: 74-90  
**영향**: 높음

```typescript
// 현재: 인증 없이 모든 예약 조회 가능
export async function GET() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(reservations)
}
```

**수정안**:
```typescript
export async function GET(request: NextRequest) {
  // API 키 또는 세션 기반 인증
  const apiKey = request.headers.get('x-api-key')
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // 또는 NextAuth 사용
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // ...
}
```

---

### P1 - 보안: 입력 검증 부족
**파일**: `src/app/api/reservations/route.ts`  
**라인**: 8-17  
**영향**: 중간

```typescript
// 현재: 기본적인 null 체크만
if (!name || !phone || !date || !time) {
  return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 })
}
// 전화번호 형식, 날짜 유효성, XSS 방지 없음
```

**수정안**:
```typescript
import { z } from 'zod'

const reservationSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(/^[0-9-]+$/).min(10).max(20),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  service: z.string().max(200).optional(),
  message: z.string().max(1000).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = reservationSchema.parse(body)
    
    // 날짜 유효성 추가 체크
    const reservationDate = new Date(validated.date)
    if (reservationDate < new Date()) {
      return NextResponse.json({ error: '과거 날짜는 선택할 수 없습니다.' }, { status: 400 })
    }
    
    // ...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    throw error
  }
}
```

---

### P1 - 보안: 하드코딩된 민감 정보
**파일**: `src/app/api/send-email/route.ts`  
**라인**: 37-38, 94  
**영향**: 중간

```typescript
// 현재
from: '은파미용실 <noreply@yourdomain.com>',  // 하드코딩
to: ['dlehddyd535@gmail.com'],  // 하드코딩

// EmailTemplate.tsx:94
<a href="http://localhost:3001/admin">  // 하드코딩
```

**수정안**:
```typescript
// .env.local
ADMIN_EMAIL=dlehddyd535@gmail.com
EMAIL_FROM=은파미용실 <noreply@yourdomain.com>
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

// route.ts
from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
to: [process.env.ADMIN_EMAIL || ''],
```

---

### P1 - 성능: 동기적 이메일 전송
**파일**: `src/app/api/reservations/route.ts`  
**라인**: 32-56  
**영향**: 중간

```typescript
// 현재: HTTP fetch로 동기 처리 - 응답 지연
const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email`, {
  // ...
})
```

**수정안**:
```typescript
// 옵션 1: 백그라운드 작업 (Next.js 15+)
import { queue } from '@/lib/queue'

// 예약 저장 후
await prisma.reservation.create({ ... })

// 비동기 큐에 추가 (응답 차단 안 함)
queue.add('send-email', { name, email, ... })

return NextResponse.json({ message: '예약이 성공적으로 저장되었습니다.' }, { status: 201 })

// 옵션 2: Edge Function 또는 별도 워커
```

---

### P1 - 에러 처리: 과도하게 일반적인 에러 메시지
**파일**: `src/app/api/reservations/route.ts`  
**라인**: 65-71  
**영향**: 낮음

```typescript
// 현재: 모든 에러를 "서버 오류"로 처리
catch (error) {
  console.error('예약 저장 중 오류:', error)
  return NextResponse.json(
    { error: '서버 오류가 발생했습니다.' },
    { status: 500 }
  )
}
```

**수정안**:
```typescript
catch (error) {
  console.error('예약 저장 중 오류:', error)
  
  // Prisma 에러 분류
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: '중복된 예약이 있습니다.' }, { status: 409 })
    }
  }
  
  // 개발 환경에서만 상세 에러 노출
  const message = process.env.NODE_ENV === 'development' 
    ? error.message 
    : '서버 오류가 발생했습니다.'
    
  return NextResponse.json({ error: message }, { status: 500 })
}
```

---

### P2 - 클라이언트: SSR/CSR 하이드레이션 불일치
**파일**: `src/contexts/LanguageContext.tsx`  
**라인**: 18-33  
**영향**: 낮음

```typescript
// 현재: 서버에서는 localStorage 접근 불가
useEffect(() => {
  const savedLanguage = localStorage.getItem('language') as Language
  // 서버 렌더링 시 undefined
}, [])
```

**수정안**:
```typescript
const [language, setLanguageState] = useState<Language>('ko')
const [isMounted, setIsMounted] = useState(false)

useEffect(() => {
  setIsMounted(true)
  const savedLanguage = localStorage.getItem('language') as Language
  if (savedLanguage && ['ko', 'en', 'ja'].includes(savedLanguage)) {
    setLanguageState(savedLanguage)
  }
}, [])

// 초기 렌더링 시 서버와 클라이언트 일치
if (!isMounted) {
  return { language: 'ko', setLanguage, t: translations.ko }
}
```

---

### P2 - 타입 안정성: API 응답 타입 부재
**파일**: `src/components/Contact.tsx`, `src/app/admin/page.tsx`  
**라인**: 34, 30  
**영향**: 낮음

```typescript
// 현재: any 타입으로 응답 처리
const response = await fetch('/api/reservations')
const data = await response.json()  // any
```

**수정안**:
```typescript
// types/api.ts
export interface ReservationResponse {
  id: number
  name: string
  email?: string
  phone: string
  date: string
  time: string
  service?: string
  message?: string
  createdAt: string
}

export interface ApiError {
  error: string
}

// 사용
const data = await response.json() as ReservationResponse[]
```

---

### P2 - 유지보수성: Prisma 클라이언트 싱글톤 패턴
**파일**: `src/lib/prisma.ts`  
**라인**: 7-9  
**영향**: 낮음

```typescript
// 현재: production에서도 싱글톤이 아닐 수 있음
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**수정안**:
```typescript
// production에서도 싱글톤 보장
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
} else {
  // production에서도 재사용
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma
  }
}
```

---

## 리팩토링 계획 (10-15줄)

1. **보안 강화 (1주)**
   - NextAuth 또는 API 키 기반 인증 추가
   - Admin 페이지 및 GET /api/reservations 보호
   - 환경 변수로 민감 정보 이동

2. **입력 검증 강화 (3일)**
   - Zod 스키마로 모든 입력 검증
   - 전화번호, 날짜 형식 검증
   - XSS 방지 (DOMPurify 또는 React 이스케이프)

3. **에러 처리 개선 (2일)**
   - Prisma 에러 분류 및 적절한 HTTP 상태 코드
   - 개발/프로덕션 환경별 에러 메시지

4. **성능 최적화 (2일)**
   - 이메일 전송을 비동기 큐로 이동
   - API 응답 시간 개선

5. **타입 안정성 (1일)**
   - API 응답 타입 정의
   - 공통 타입 파일 생성

---

## 유닛 테스트 제안

### 1. 예약 API 검증 테스트
```typescript
describe('POST /api/reservations', () => {
  it('should reject invalid phone number', async () => {
    const response = await POST({
      name: 'Test',
      phone: 'invalid-phone',
      date: '2024-12-31',
      time: '10:00'
    })
    expect(response.status).toBe(400)
  })
  
  it('should reject past dates', async () => {
    const response = await POST({
      name: 'Test',
      phone: '010-1234-5678',
      date: '2020-01-01',
      time: '10:00'
    })
    expect(response.status).toBe(400)
  })
  
  it('should sanitize XSS in message field', async () => {
    const response = await POST({
      name: 'Test',
      phone: '010-1234-5678',
      date: '2024-12-31',
      time: '10:00',
      message: '<script>alert("xss")</script>'
    })
    const data = await response.json()
    expect(data.reservation.message).not.toContain('<script>')
  })
})
```

### 2. 인증 미들웨어 테스트
```typescript
describe('Admin authentication', () => {
  it('should reject unauthenticated requests', async () => {
    const response = await fetch('/api/reservations')
    expect(response.status).toBe(401)
  })
  
  it('should allow authenticated admin access', async () => {
    const response = await fetch('/api/reservations', {
      headers: { 'x-api-key': process.env.ADMIN_API_KEY }
    })
    expect(response.status).toBe(200)
  })
})
```

### 3. 이메일 템플릿 렌더링 테스트
```typescript
describe('EmailTemplate', () => {
  it('should render all required fields', () => {
    const template = EmailTemplate({
      name: 'John Doe',
      phone: '010-1234-5678',
      date: '2024-12-31',
      time: '10:00'
    })
    expect(template).toContain('John Doe')
    expect(template).toContain('010-1234-5678')
  })
  
  it('should handle optional fields gracefully', () => {
    const template = EmailTemplate({
      name: 'John',
      phone: '010-1234-5678',
      date: '2024-12-31',
      time: '10:00',
      email: undefined,
      service: undefined
    })
    expect(template).not.toContain('undefined')
  })
})
```

### 4. 언어 컨텍스트 테스트
```typescript
describe('LanguageContext', () => {
  it('should default to Korean', () => {
    const { result } = renderHook(() => useLanguage())
    expect(result.current.language).toBe('ko')
  })
  
  it('should persist language selection', () => {
    const { result } = renderHook(() => useLanguage())
    act(() => {
      result.current.setLanguage('en')
    })
    expect(localStorage.getItem('language')).toBe('en')
  })
})
```

### 5. Prisma 클라이언트 싱글톤 테스트
```typescript
describe('Prisma client', () => {
  it('should return same instance on multiple imports', () => {
    const prisma1 = require('@/lib/prisma').prisma
    const prisma2 = require('@/lib/prisma').prisma
    expect(prisma1).toBe(prisma2)
  })
})
```

---

## 우선순위 요약

| 우선순위 | 문제 | 영향 | 예상 작업 시간 |
|---------|------|------|--------------|
| P0 | Admin 인증 없음 | 높음 | 1일 |
| P0 | 공개 API 엔드포인트 | 높음 | 1일 |
| P1 | 입력 검증 부족 | 중간 | 3일 |
| P1 | 하드코딩된 민감 정보 | 중간 | 0.5일 |
| P1 | 동기적 이메일 전송 | 중간 | 2일 |
| P1 | 에러 처리 개선 | 낮음 | 2일 |
| P2 | SSR 하이드레이션 불일치 | 낮음 | 1일 |
| P2 | 타입 안정성 | 낮음 | 1일 |
| P2 | Prisma 싱글톤 패턴 | 낮음 | 0.5일 |

**총 예상 작업 시간**: 약 2주

