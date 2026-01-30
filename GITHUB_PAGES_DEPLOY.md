# 🚀 GitHub Pages 배포 가이드

## ✅ 완료된 작업

1. ✅ Vercel 관련 파일 삭제
2. ✅ Next.js 정적 export 설정
3. ✅ GitHub Actions 워크플로우 생성
4. ✅ 예약 폼을 외부 서비스(Formspree/mailto)로 변경

---

## 📋 배포 전 설정

### 1. GitHub Pages 활성화

1. **GitHub 저장소 설정**
   - https://github.com/YIDONGYONG/unmap-salon-website 접속
   - Settings → Pages
   - Source: "GitHub Actions" 선택
   - Save 클릭

### 2. 예약 폼 설정 (선택사항)

현재는 **mailto 링크**로 작동합니다. 더 나은 사용자 경험을 위해 Formspree 사용을 권장합니다.

#### Formspree 설정 (무료)

1. https://formspree.io 가입
2. 새 폼 생성
3. Form ID 복사
4. 환경 변수 설정:
   - GitHub 저장소 → Settings → Secrets and variables → Actions
   - New repository secret 추가:
     - Name: `FORMSPREE_ID`
     - Value: Formspree에서 받은 Form ID
5. 코드 업데이트 (이미 설정됨)

---

## 🚀 자동 배포

### GitHub Actions를 통한 자동 배포

1. **main 브랜치에 푸시하면 자동 배포**
   ```bash
   git push origin main
   ```

2. **배포 상태 확인**
   - GitHub 저장소 → Actions 탭
   - 워크플로우 실행 상태 확인

3. **배포 완료 후 사이트 접속**
   - URL: `https://YIDONGYONG.github.io/unmap-salon-website`
   - 또는 저장소 Settings → Pages에서 확인

---

## 📝 주의사항

### GitHub Pages 제한사항

1. **정적 사이트만 가능**
   - API 라우트 작동 안 함
   - 서버 사이드 기능 불가
   - 데이터베이스 연결 불가

2. **예약 기능**
   - 현재: mailto 링크 사용 (이메일 앱 열림)
   - 권장: Formspree 사용 (더 나은 UX)

3. **Admin 페이지**
   - `/admin` 페이지는 정적 페이지로만 표시됨
   - 데이터 조회 기능은 작동하지 않음

---

## 🔧 로컬 테스트

```bash
# 빌드
npm run build

# out 폴더 확인
ls -la out

# 로컬 서버로 테스트
npx serve out
```

---

## 🌐 사이트 URL

배포 완료 후:
- **프로덕션 URL**: `https://YIDONGYONG.github.io/unmap-salon-website`
- **커스텀 도메인**: Settings → Pages → Custom domain에서 설정 가능

---

## 🆘 문제 해결

### 빌드 실패 시

1. **Actions 탭에서 로그 확인**
   - 빌드 에러 메시지 확인
   - Node 버전 확인 (20 사용)

2. **로컬에서 빌드 테스트**
   ```bash
   npm run build
   ```

### 사이트가 표시되지 않을 때

1. **GitHub Pages 설정 확인**
   - Settings → Pages → Source가 "GitHub Actions"인지 확인

2. **Actions 워크플로우 확인**
   - Actions 탭에서 최신 워크플로우 실행 상태 확인
   - "Deploy to GitHub Pages" 단계가 성공했는지 확인

3. **캐시 문제**
   - 브라우저 캐시 삭제
   - 시크릿 모드에서 접속

---

## 📊 기능 비교

| 기능 | Vercel | GitHub Pages |
|------|--------|--------------|
| API 라우트 | ✅ 지원 | ❌ 불가 |
| 서버리스 함수 | ✅ 지원 | ❌ 불가 |
| 데이터베이스 | ✅ 지원 | ❌ 불가 |
| 정적 사이트 | ✅ 지원 | ✅ 지원 |
| 무료 플랜 | ✅ 제공 | ✅ 제공 |
| 자동 배포 | ✅ 지원 | ✅ 지원 (Actions) |

---

**작성일:** 2025-01-XX  
**다음 단계:** GitHub Pages 활성화 → 자동 배포 확인

