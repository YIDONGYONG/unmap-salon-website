# 🚀 Vercel 배포 가이드

## ✅ GitHub 푸시 완료

코드가 성공적으로 GitHub에 푸시되었습니다:
- 저장소: https://github.com/YIDONGYONG/unmap-salon-website

---

## 🌐 Vercel 배포 단계

### 1단계: Vercel 가입 및 프로젝트 연결

1. **Vercel 접속**
   - https://vercel.com 접속
   - "Sign Up" 또는 "Log In" 클릭
   - **GitHub 계정으로 로그인** (중요: GitHub 연동 필요)

2. **프로젝트 가져오기**
   - 대시보드에서 "Add New Project" 클릭
   - "Import Git Repository" 선택
   - GitHub 저장소 목록에서 `YIDONGYONG/unmap-salon-website` 선택
   - "Import" 클릭

3. **프로젝트 설정**
   - Framework Preset: **Next.js** (자동 감지됨)
   - Root Directory: `./` (기본값 유지)
   - Build Command: `npm run build` (기본값)
   - Output Directory: `.next` (기본값)
   - Install Command: `npm install` (기본값)

---

### 2단계: 데이터베이스 설정 (⚠️ 필수)

**현재 문제:** Prisma schema가 SQLite로 설정되어 있음
**해결:** PostgreSQL 데이터베이스 생성 필요

#### 옵션 A: Vercel Postgres 사용 (추천)

1. **Vercel Dashboard에서 Postgres 생성**
   - 프로젝트 페이지 → "Storage" 탭
   - "Create Database" → "Postgres" 선택
   - 데이터베이스 이름 입력 (예: `unmap-salon-db`)
   - 지역 선택 (가장 가까운 지역)
   - "Create" 클릭

2. **연결 문자열 복사**
   - 생성된 데이터베이스 → "Settings" → "Connection String" 복사
   - 형식: `postgresql://user:password@host:5432/dbname?sslmode=require`

3. **환경 변수에 추가**
   - 프로젝트 → "Settings" → "Environment Variables"
   - Name: `DATABASE_URL`
   - Value: 위에서 복사한 연결 문자열
   - Environment: Production, Preview, Development 모두 선택
   - "Save" 클릭

#### 옵션 B: Supabase 사용 (무료 플랜)

1. https://supabase.com 가입
2. 새 프로젝트 생성
3. Settings → Database → Connection string 복사
4. Vercel 환경 변수에 `DATABASE_URL`로 추가

---

### 3단계: 환경 변수 설정 (⚠️ 필수)

프로젝트 → "Settings" → "Environment Variables"에서 다음 변수들을 추가:

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `RESEND_API_KEY` | Resend 이메일 API 키 | `re_xxxxxxxxxxxxx` |
| `ADMIN_EMAIL` | 예약 알림 수신 이메일 | `your-email@example.com` |
| `ADMIN_API_TOKEN` | Admin API 인증 토큰 | 랜덤 문자열 (32자 이상) |
| `NEXT_PUBLIC_BASE_URL` | 배포된 사이트 URL | `https://your-app.vercel.app` |

**생성 방법:**
- `RESEND_API_KEY`: https://resend.com 가입 후 API 키 발급
- `ADMIN_API_TOKEN`: 온라인 랜덤 문자열 생성기 사용 또는 `openssl rand -base64 32`

**중요:** 모든 환경 변수는 Production, Preview, Development 모두에 추가하세요.

---

### 4단계: Prisma 마이그레이션

배포 전에 데이터베이스 스키마를 생성해야 합니다.

**방법 1: Vercel Build Command에 추가 (자동)**

`vercel.json` 파일이 이미 있으므로, Vercel이 자동으로 빌드합니다.

**방법 2: 수동 마이그레이션 (로컬에서)**

```bash
# 환경 변수 설정
export DATABASE_URL="postgresql://..."

# 마이그레이션 실행
npx prisma migrate deploy
npx prisma generate
```

**방법 3: Vercel CLI 사용**

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 환경 변수 연결
vercel env pull .env.local

# 마이그레이션
npx prisma migrate deploy
```

---

### 5단계: 배포 실행

1. **자동 배포**
   - GitHub에 푸시하면 자동으로 배포됩니다
   - 또는 Vercel Dashboard에서 "Deploy" 클릭

2. **배포 상태 확인**
   - Vercel Dashboard → "Deployments" 탭
   - 빌드 로그 확인

3. **배포 완료 후**
   - 배포된 URL 확인 (예: `https://unmap-salon-website.vercel.app`)
   - `NEXT_PUBLIC_BASE_URL` 환경 변수를 실제 URL로 업데이트

---

## 🔧 배포 후 확인 사항

### 1. 기본 동작 테스트
- [ ] 홈페이지 로딩 확인
- [ ] 예약 폼 제출 테스트
- [ ] `/admin` 페이지 접근 (토큰 입력 필요)

### 2. 에러 로그 확인
- Vercel Dashboard → "Functions" → "Logs"
- 빌드 에러가 있는지 확인

### 3. 데이터베이스 연결 확인
- Vercel Dashboard → "Storage" → 데이터베이스 상태
- Prisma Studio로 데이터 확인 (선택사항)

### 4. 환경 변수 확인
- 모든 환경 변수가 올바르게 설정되었는지 확인
- 특히 `DATABASE_URL` 형식 확인

---

## 🚨 문제 해결

### 빌드 실패 시

**문제:** "Prisma Client not generated"
**해결:**
```bash
# vercel.json에 postinstall 추가
{
  "buildCommand": "npm run build",
  "installCommand": "npm install && npx prisma generate"
}
```

**문제:** "DATABASE_URL is not set"
**해결:**
- 환경 변수가 모든 환경(Production, Preview, Development)에 설정되었는지 확인

**문제:** "Connection refused"
**해결:**
- `DATABASE_URL`에 `?sslmode=require` 추가
- 데이터베이스 방화벽 설정 확인

### 런타임 에러 시

**문제:** "Rate limit exceeded"
**해결:**
- Rate limiting이 정상 작동 중 (의도된 동작)
- 60초 후 다시 시도

**문제:** "Unauthorized" (Admin 페이지)
**해결:**
- `ADMIN_API_TOKEN` 환경 변수 확인
- Admin 페이지에서 올바른 토큰 입력

---

## 📊 비용 모니터링

### Vercel 무료 플랜 제한
- 대역폭: 100GB/월
- 서버리스 함수 실행: 100GB-시간/월
- 빌드: 6000분/월

### Resend 무료 플랜 제한
- 이메일: 100건/일
- 초과 시: $0.30/1000건

### 모니터링 방법
- Vercel Dashboard → "Usage" 탭
- Resend Dashboard → "Usage" 탭

---

## 🎉 배포 완료!

배포가 완료되면:
1. 사이트 URL 확인
2. Google Search Console 등록 (선택사항)
3. Google My Business 등록 (선택사항)

---

**작성일:** 2025-01-XX  
**다음 단계:** Vercel에서 프로젝트 가져오기 → 환경 변수 설정 → 배포

