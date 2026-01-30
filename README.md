# Beauty Salon Website

Next.js와 TailwindCSS로 제작된 미용실 웹사이트입니다.

## 🎨 주요 기능

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기에서 최적화
- **다국어 지원**: 한국어, 영어, 일본어 완전 지원
- **Sticky Header**: 스크롤해도 예약 버튼이 항상 노출
- **Hero 섹션**: 감각적인 배경과 강조된 CTA 버튼
- **서비스 소개**: 3열 그리드 레이아웃과 hover 애니메이션
- **가격표**: 패키지별 가격 정보와 개별 서비스 가격
- **Google Maps**: 실제 위치 표시
- **이메일 알림**: Resend를 통한 무료 예약 알림
- **예약 시스템**: SQLite 데이터베이스 기반 예약 관리
- **관리자 페이지**: 예약 목록 확인 및 관리
- **모던 UI**: TailwindCSS 기반의 아름다운 디자인

## 🚀 시작하기

### 필수 조건

- Node.js 18.0 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx          # 메인 페이지
│   ├── layout.tsx        # 레이아웃
│   └── globals.css       # 전역 스타일
└── components/
    ├── Header.tsx        # 헤더 컴포넌트
    ├── Hero.tsx          # 히어로 섹션
    ├── Services.tsx      # 서비스 소개
    ├── Pricing.tsx       # 가격표
    ├── Contact.tsx       # 예약 문의 폼
    └── Footer.tsx        # 푸터
```

## 🛠️ 기술 스택

- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안정성
- **TailwindCSS** - 유틸리티 기반 CSS 프레임워크
- **Prisma** - 데이터베이스 ORM
- **SQLite** - 로컬 데이터베이스
- **Google Maps** - 위치 표시
- **Resend** - 이메일 전송 서비스

## 📧 예약 시스템 설정

### 데이터베이스 설정

1. **데이터베이스 생성**:
```bash
npx prisma generate
npx prisma db push
```

2. **관리자 페이지 접속**:
   - `http://localhost:3000/admin`에서 예약 목록 확인

3. **이메일 알림 설정**:
   - [Resend](https://resend.com)에서 무료 계정 생성
   - API 키 발급 후 `.env.local` 파일에 설정:
   ```bash
   RESEND_API_KEY=your_resend_api_key_here
   ```

### Google Maps 설정

실제 Google Maps를 사용하려면:

1. [Google Cloud Console](https://console.cloud.google.com/)에서 API 키 생성
2. `src/components/Contact.tsx`의 iframe src를 실제 위치로 수정

## 💰 서버 비용 및 추천

### 데이터베이스 비용

**무료 옵션들:**
- **SQLite** (현재 사용): 완전 무료
- **Supabase**: 월 500MB까지 무료
- **PlanetScale**: 월 1GB까지 무료
- **Railway**: 월 $5부터

### 호스팅 추천 (최저가)

1. **Vercel** (추천)
   - 개인 프로젝트: 무료
   - 월 100GB 대역폭
   - 자동 배포

2. **Netlify**
   - 개인 프로젝트: 무료
   - 월 100GB 대역폭

3. **Railway**
   - 월 $5부터
   - 데이터베이스 포함

4. **Render**
   - 월 $7부터
   - 무료 티어 있음

### 예상 월 비용

- **무료 플랜**: $0 (Vercel + SQLite)
- **기본 플랜**: $5-10 (Railway/Render)
- **프로덕션**: $20-50 (고급 기능 포함)

## 🎨 커스터마이징

### 색상 변경

TailwindCSS 설정에서 기본 색상을 변경할 수 있습니다:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        pink: {
          400: '#f472b6', // 원하는 색상으로 변경
          600: '#db2777',
        }
      }
    }
  }
}
```

### 내용 수정

각 컴포넌트 파일에서 텍스트, 가격, 서비스 정보 등을 쉽게 수정할 수 있습니다.

## 📱 반응형 디자인

- **모바일**: 320px 이상
- **태블릿**: 768px 이상  
- **데스크톱**: 1024px 이상

모든 섹션이 각 화면 크기에 최적화되어 있습니다.

## 🚀 배포

### Vercel (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 기타 플랫폼

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**Beauty Salon Website** - 당신의 아름다움을 완성하는 곳 ✨
