# 🚀 Netlify 배포 가이드

## 📋 배포 전 체크리스트

### 1. 프로젝트 준비 완료 ✅
- [x] Next.js 프로젝트 빌드 성공
- [x] Netlify 설정 파일 생성
- [x] Next.js 플러그인 설치

### 2. 배포 방법

#### 방법 1: Netlify CLI 사용 (추천)

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 배포
netlify deploy --prod
```

#### 방법 2: Netlify 웹사이트에서 배포

1. [Netlify.com](https://netlify.com) 접속
2. 로그인 후 "New site from Git" 클릭
3. GitHub 저장소 연결
4. 빌드 설정:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. "Deploy site" 클릭

#### 방법 3: 드래그 앤 드롭 (정적 사이트용)

```bash
# 정적 파일 생성
npm run build
npm run export  # (필요시)

# .next 폴더를 Netlify에 드래그
```

## 🔧 환경 변수 설정

Netlify 대시보드에서 환경 변수 설정:

### 필수 환경 변수
```
NODE_VERSION=18
```

### 선택적 환경 변수 (이메일 기능용)
```
RESEND_API_KEY=your_resend_api_key_here
```

## 🌐 도메인 설정

### 기본 도메인
- `your-project-name.netlify.app`

### 커스텀 도메인 (선택사항)
1. Netlify 대시보드 → Site settings → Domain management
2. "Add custom domain" 클릭
3. 도메인 입력 및 DNS 설정

## 📱 배포 후 확인사항

### 1. 메인 페이지
- [ ] 홈페이지 로딩 확인
- [ ] 다국어 기능 작동 확인
- [ ] 반응형 디자인 확인

### 2. 예약 기능
- [ ] 예약 폼 작동 확인
- [ ] 데이터베이스 저장 확인
- [ ] 관리자 페이지 접속 확인

### 3. 이메일 기능 (선택사항)
- [ ] Resend API 키 설정
- [ ] 이메일 전송 테스트

## 🛠️ 문제 해결

### 빌드 오류
```bash
# 로컬에서 빌드 테스트
npm run build

# 오류 확인 후 수정
```

### 환경 변수 문제
- Netlify 대시보드에서 환경 변수 재설정
- 빌드 로그 확인

### 데이터베이스 문제
- SQLite는 로컬 파일이므로 배포 시 별도 설정 필요
- 프로덕션에서는 PostgreSQL 등 사용 권장

## 📞 지원

문제가 발생하면:
1. Netlify 빌드 로그 확인
2. 로컬 빌드 테스트
3. 환경 변수 설정 확인





















