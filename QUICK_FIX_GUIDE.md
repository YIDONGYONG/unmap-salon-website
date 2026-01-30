# 🚀 긴급 수정 가이드 (배포 전 필수)

이 문서는 발견된 **치명적 보안 취약점**을 빠르게 수정하기 위한 단계별 가이드입니다.

---

## ⚠️ 배포 전 반드시 해결해야 할 3가지

### 1. 데이터베이스 전환 (SQLite → PostgreSQL)

**현재 상태:** ❌ SQLite 사용 중 (프로덕션에서 작동 불가)

**해결 방법:**

#### 옵션 A: Vercel Postgres (추천)
1. Vercel Dashboard → Storage → Create Database → Postgres
2. `.env.local`에 `DATABASE_URL` 복사
3. Prisma schema 수정:

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // sqlite → postgresql 변경
  url      = env("DATABASE_URL")
}
```

4. 마이그레이션 실행:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### 옵션 B: Supabase (무료 플랜 제공)
1. [Supabase](https://supabase.com) 가입
2. 새 프로젝트 생성
3. Settings → Database → Connection string 복사
4. 위와 동일하게 Prisma 설정

**⏱️ 예상 시간:** 10-15분

---

### 2. 환경 변수 설정

**필수 환경 변수:**
```bash
DATABASE_URL="postgresql://..."          # 위에서 생성한 DB URL
RESEND_API_KEY="re_xxxxx"                # Resend 대시보드에서 발급
ADMIN_EMAIL="your-email@example.com"     # 예약 알림 수신 이메일
ADMIN_API_TOKEN="secure-random-string"   # 랜덤 문자열 (32자 이상 권장)
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

**생성 방법:**
- `ADMIN_API_TOKEN`: 온라인 랜덤 문자열 생성기 사용 또는 `openssl rand -base64 32`

**Vercel 설정:**
1. Dashboard → Project → Settings → Environment Variables
2. 위 변수들 모두 추가

**Netlify 설정:**
1. Site settings → Environment variables
2. 위 변수들 모두 추가

**⏱️ 예상 시간:** 5분

---

### 3. Admin 페이지 인증 테스트

**수정 완료된 기능:**
- ✅ GET /api/reservations에 인증 추가됨
- ✅ Admin 페이지에서 토큰 입력 요구

**테스트 방법:**
1. `/admin` 페이지 접속
2. 토큰 입력 프롬프에서 `ADMIN_API_TOKEN` 값 입력
3. 예약 목록이 정상적으로 표시되는지 확인

**⏱️ 예상 시간:** 2분

---

## ✅ 이미 수정 완료된 항목

1. ✅ GET /api/reservations 인증 추가
2. ✅ 하드코딩된 이메일 주소 → 환경 변수로 변경
3. ✅ Rate Limiting 구현 (60초에 10회 제한)
4. ✅ 입력 검증 강화 (Zod 스키마)
5. ✅ SEO 파일 생성 (robots.txt, sitemap.ts)
6. ✅ 메타데이터 강화 (OG 태그, 구조화 데이터)

---

## 📦 추가 설치 필요

Zod 라이브러리 설치:
```bash
npm install zod
```

---

## 🧪 배포 전 최종 테스트

### 로컬 테스트
```bash
# 1. 환경 변수 설정
cp .env.example .env.local
# .env.local 파일 편집하여 실제 값 입력

# 2. 의존성 설치
npm install

# 3. 데이터베이스 마이그레이션
npx prisma migrate dev
npx prisma generate

# 4. 빌드 테스트
npm run build

# 5. 프로덕션 모드 실행
npm start

# 6. 테스트
# - http://localhost:3001 접속
# - 예약 폼 제출 테스트
# - /admin 페이지 접속 및 토큰 입력 테스트
```

### 배포 후 테스트
- [ ] 홈페이지 로딩 확인
- [ ] 예약 폼 제출 성공
- [ ] 이메일 수신 확인
- [ ] Admin 페이지 접근 (토큰 필요)
- [ ] Rate limiting 동작 확인 (10회 이상 연속 요청 시 429 에러)

---

## 🚨 긴급 상황 대응

### 비용 폭증 발생 시
1. Vercel/Netlify 대시보드에서 함수 실행 중지
2. Resend API 키 비활성화
3. Rate limiting 값 긴급 조정 (10회 → 5회)

### 데이터 유출 의심 시
1. `ADMIN_API_TOKEN` 즉시 재생성
2. Vercel/Netlify 환경 변수 업데이트
3. 모든 세션 무효화

---

## 📞 다음 단계

모든 수정 완료 후:
1. `DEPLOYMENT_CHECKLIST.md`의 "최종 배포 승인 기준" 확인
2. 모든 체크리스트 항목 완료 확인
3. 배포 실행
4. 배포 후 24시간 모니터링

---

**작성일:** 2025-01-XX  
**우선순위:** 🔴 최우선 (배포 전 필수)

