# 🚀 GitHub 배포 완료 가이드

## ✅ 완료된 작업

1. ✅ Git 저장소 초기화
2. ✅ 원격 저장소 연결 (https://github.com/YIDONGYONG/unmap-salon-website.git)
3. ✅ 모든 파일 커밋 완료 (42개 파일, 11,173줄)

## 📤 GitHub에 푸시하기

현재 코드는 로컬에 커밋되었습니다. 다음 명령어로 GitHub에 푸시하세요:

```bash
git push -u origin main
```

**인증 방법:**

### 옵션 1: Personal Access Token 사용 (추천)
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" 클릭
3. 권한 선택: `repo` (전체 저장소 접근)
4. 토큰 생성 후 복사
5. 푸시 시 비밀번호 대신 토큰 입력

### 옵션 2: SSH 키 사용
```bash
# SSH URL로 변경
git remote set-url origin git@github.com:YIDONGYONG/unmap-salon-website.git
git push -u origin main
```

### 옵션 3: GitHub CLI 사용
```bash
gh auth login
git push -u origin main
```

---

## 🌐 배포 플랫폼 연결

### Vercel 배포 (추천)

1. **Vercel 가입/로그인**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **프로젝트 가져오기**
   - "Add New Project" 클릭
   - GitHub 저장소 선택: `YIDONGYONG/unmap-salon-website`
   - Framework Preset: Next.js (자동 감지)
   - Root Directory: `./` (기본값)

3. **환경 변수 설정** (⚠️ 필수)
   ```
   DATABASE_URL=postgresql://...          # Vercel Postgres에서 생성
   RESEND_API_KEY=re_xxxxx                 # Resend 대시보드에서 발급
   ADMIN_EMAIL=your-email@example.com     # 예약 알림 수신 이메일
   ADMIN_API_TOKEN=secure-random-string   # 랜덤 문자열 (32자 이상)
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```

4. **데이터베이스 설정** (⚠️ 필수 - SQLite는 작동 안 함)
   - Vercel Dashboard → Storage → Create Database → Postgres
   - 생성된 `DATABASE_URL`을 환경 변수에 추가
   - Prisma schema 수정:
     ```prisma
     datasource db {
       provider = "postgresql"  // sqlite → postgresql 변경
       url      = env("DATABASE_URL")
     }
     ```
   - 마이그레이션 실행:
     ```bash
     npx prisma migrate deploy
     npx prisma generate
     ```

5. **배포 실행**
   - "Deploy" 클릭
   - 배포 완료 후 자동으로 URL 생성

---

### Netlify 배포

1. **Netlify 가입/로그인**
   - https://netlify.com 접속
   - GitHub 계정으로 로그인

2. **프로젝트 가져오기**
   - "Add new site" → "Import an existing project"
   - GitHub 저장소 선택: `YIDONGYONG/unmap-salon-website`
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

3. **환경 변수 설정** (⚠️ 필수)
   - Site settings → Environment variables
   - 위와 동일한 환경 변수 추가

4. **데이터베이스 설정** (⚠️ 필수)
   - Supabase 또는 다른 PostgreSQL 서비스 사용
   - `DATABASE_URL` 환경 변수에 연결 문자열 추가

5. **배포 실행**
   - "Deploy site" 클릭

---

## ⚠️ 배포 전 필수 체크리스트

### 치명적 (반드시 해결)

- [ ] **데이터베이스 전환**: SQLite → PostgreSQL
  - 현재 Prisma schema는 SQLite 사용 중
  - Vercel/Netlify는 파일 시스템이 읽기 전용이므로 SQLite 작동 불가
  - **해결 방법**: `QUICK_FIX_GUIDE.md` 참고

- [ ] **환경 변수 설정**
  - `DATABASE_URL` (PostgreSQL)
  - `RESEND_API_KEY`
  - `ADMIN_EMAIL`
  - `ADMIN_API_TOKEN` (랜덤 문자열 생성)
  - `NEXT_PUBLIC_BASE_URL`

- [ ] **Zod 라이브러리 설치**
  ```bash
  npm install zod
  ```
  - 또는 배포 플랫폼의 빌드 설정에서 자동 설치됨

### 권장 사항

- [ ] Google Search Console 등록
- [ ] Google My Business 등록
- [ ] 도메인 연결 (선택사항)

---

## 🔧 배포 후 확인 사항

1. **기본 동작 확인**
   - [ ] 홈페이지 로딩
   - [ ] 예약 폼 제출 테스트
   - [ ] `/admin` 페이지 접근 (토큰 필요)

2. **에러 로그 확인**
   - Vercel: Dashboard → Functions → Logs
   - Netlify: Functions → Logs

3. **비용 모니터링**
   - Vercel: Usage 탭
   - Resend: Dashboard → Usage

---

## 📚 참고 문서

- `DEPLOYMENT_CHECKLIST.md` - 상세한 배포 체크리스트
- `QUICK_FIX_GUIDE.md` - 긴급 수정 가이드
- `README.md` - 프로젝트 개요

---

## 🆘 문제 해결

### 빌드 실패 시
- 환경 변수 누락 확인
- `npm install` 로컬에서 실행하여 의존성 확인
- Prisma schema 수정 확인 (PostgreSQL로 변경)

### 데이터베이스 연결 실패 시
- `DATABASE_URL` 형식 확인
- PostgreSQL 서비스 상태 확인
- SSL 모드 확인 (`?sslmode=require`)

### API 오류 시
- 환경 변수 모두 설정되었는지 확인
- Rate limiting 로그 확인
- Admin 토큰 정확성 확인

---

**작성일:** 2025-01-XX  
**다음 단계:** GitHub 푸시 → 배포 플랫폼 연결 → 환경 변수 설정 → 배포

