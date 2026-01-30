# 🔧 GitHub Pages 배포 문제 해결 가이드

## 문제 상황
- "There isn't a GitHub Pages site here" 메시지 표시
- 배포가 되지 않음

## 해결 방법

### 1단계: GitHub Pages 활성화 (필수)

1. **GitHub 저장소 접속**
   - https://github.com/YIDONGYONG/unmap-salon-website

2. **Settings → Pages**
   - 왼쪽 메뉴에서 "Pages" 클릭

3. **Source 설정**
   - "Source" 섹션에서 **"GitHub Actions"** 선택
   - Save 클릭

4. **확인**
   - "Your site is live at..." 메시지가 나타나면 성공
   - 또는 Actions 탭에서 워크플로우 실행 확인

---

### 2단계: GitHub Actions 워크플로우 확인

1. **Actions 탭 확인**
   - 저장소 상단의 "Actions" 탭 클릭
   - "Deploy to GitHub Pages" 워크플로우 확인

2. **워크플로우 실행 확인**
   - 최신 워크플로우 실행 클릭
   - 빌드 단계가 성공했는지 확인
   - 에러가 있다면 에러 메시지 확인

3. **수동 실행 (필요시)**
   - Actions 탭 → "Deploy to GitHub Pages" → "Run workflow" 클릭

---

### 3단계: 빌드 에러 확인 및 수정

#### 일반적인 빌드 에러

**에러 1: Prisma 관련 에러**
```
Error: Cannot find module '@prisma/client'
```
**해결**: Prisma는 주석처리되었으므로 빌드에서 제외됨

**에러 2: API 라우트 관련 에러**
```
Error: API routes cannot be used with output: 'export'
```
**해결**: API 라우트는 이미 주석처리됨

**에러 3: basePath 관련 에러**
```
Error: basePath must be a string
```
**해결**: next.config.ts에서 basePath 설정 확인

---

### 4단계: 로컬에서 빌드 테스트

```bash
# 환경 변수 설정
export NODE_ENV=production
export NEXT_PUBLIC_REPO_NAME=unmap-salon-website
export NEXT_PUBLIC_BASE_URL=https://YIDONGYONG.github.io/unmap-salon-website

# 빌드 실행
npm run build

# out 폴더 확인
ls -la out

# 로컬 서버로 테스트
npx serve out
```

---

### 5단계: GitHub Actions 로그 확인

1. **Actions 탭 → 최신 워크플로우 실행**
2. **각 단계 클릭하여 로그 확인**
   - "Install dependencies" - 성공 여부
   - "Build" - 빌드 성공 여부
   - "Upload artifact" - 아티팩트 업로드 성공 여부
   - "Deploy to GitHub Pages" - 배포 성공 여부

---

## 문제 해결 체크리스트

- [ ] GitHub Pages가 활성화되었는가? (Settings → Pages → Source: GitHub Actions)
- [ ] 워크플로우가 실행되었는가? (Actions 탭 확인)
- [ ] 빌드가 성공했는가? (워크플로우 로그 확인)
- [ ] 아티팩트가 업로드되었는가? (워크플로우 로그 확인)
- [ ] 배포가 성공했는가? (워크플로우 로그 확인)
- [ ] 저장소 이름이 올바른가? (`unmap-salon-website`)

---

## 추가 확인 사항

### 저장소 이름 확인
- 현재 저장소 이름: `unmap-salon-website`
- 예상 URL: `https://YIDONGYONG.github.io/unmap-salon-website`
- basePath: `/unmap-salon-website`

### 권한 확인
- GitHub Pages 권한이 있는지 확인
- 저장소가 Public인지 확인 (Private 저장소는 GitHub Pro 필요)

---

## 수동 배포 (임시 해결책)

워크플로우가 작동하지 않을 경우:

1. **로컬에서 빌드**
   ```bash
   npm run build
   ```

2. **gh-pages 브랜치 생성**
   ```bash
   git checkout -b gh-pages
   git add out
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

3. **Settings → Pages → Source: gh-pages 브랜치 선택**

---

## 연락처

문제가 계속되면:
1. GitHub Actions 로그 전체 복사
2. 에러 메시지 확인
3. 저장소 Settings → Pages 스크린샷

---

**작성일:** 2025-01-XX  
**상태:** 문제 해결 중

