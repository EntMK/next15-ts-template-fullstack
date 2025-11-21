# 3D 스크롤링 애니메이션 - Next.js 15 통합 가이드

## 개요

기존 HTML 파일의 3D 스크롤링 애니메이션을 Next.js 15 프로젝트에 최적화하여 통합했습니다.

## 설치된 라이브러리

```bash
pnpm add gsap lenis
```

- **GSAP**: 고성능 애니메이션 라이브러리
- **Lenis**: 부드러운 스크롤 라이브러리

## 파일 구조

```
src/
├── app/
│   ├── 3d-scroll/
│   │   └── page.tsx              # 3D 스크롤 메인 페이지
│   └── layout.tsx                # Google Fonts (Figtree) 추가
├── components/
│   └── 3d-scroll/
│       ├── ScrollCanvas.tsx      # 3D 캔버스 클라이언트 컴포넌트
│       └── StepSections.tsx      # Step 섹션 컴포넌트
├── styles/
│   └── 3d-scroll.css            # 3D 스크롤 전용 CSS
└── types/
    └── lenis.d.ts               # Lenis TypeScript 타입 정의
```

## 주요 기능

### 1. ScrollCanvas 컴포넌트
- 444개의 프레임 시퀀스 이미지 로딩
- 스크롤에 따른 부드러운 프레임 전환
- 로딩 프로그레스 바
- 캔버스 크기 자동 조정 (반응형)
- Lenis를 통한 부드러운 스크롤 경험

### 2. StepSections 컴포넌트
- 3개의 Step 섹션 (Mint, Hatching Day, Trading Platform)
- Intersection Observer를 통한 페이드 인 애니메이션
- 반응형 레이아웃

### 3. 최적화 포인트

#### 성능 최적화
- `useRef`를 사용한 이미지 캐싱
- GSAP ticker와 동기화된 렌더링
- Device Pixel Ratio 고려한 캔버스 해상도
- `will-change` CSS 속성을 통한 GPU 가속

#### Next.js 15 최적화
- 클라이언트 컴포넌트 분리 (`"use client"`)
- Google Fonts 최적화 (`next/font/google`)
- CSS 모듈 분리
- TypeScript 타입 안전성

## 사용 방법

### 1. 페이지 접속
```
http://localhost:3000/3d-scroll
```

### 2. 커스터마이징

#### 프레임 경로 변경
`src/app/3d-scroll/page.tsx`:
```tsx
<ScrollCanvas
  frameCount={444}
  folderPath="YOUR_FRAME_FOLDER_PATH/"
/>
```

#### Step 섹션 내용 수정
`src/components/3d-scroll/StepSections.tsx`에서 텍스트와 이미지를 수정할 수 있습니다.

#### 스타일 커스터마이징
`src/styles/3d-scroll.css`에서 색상, 폰트, 애니메이션을 조정할 수 있습니다.

## 주요 CSS 변수

```css
:root {
  --grey: #7b7d7e;
  --green: #bef0bf;
  --light-white: rgba(255, 255, 255, 0.2);
  --max-width: 1320px;
}
```

## 반응형 브레이크포인트

- **Desktop**: 기본
- **Tablet**: `max-width: 1200px`
- **Mobile**: `max-width: 768px`

## 특징

1. ✅ **Next.js 15 완전 호환**
2. ✅ **TypeScript 타입 안전성**
3. ✅ **서버/클라이언트 컴포넌트 분리**
4. ✅ **Google Fonts 최적화**
5. ✅ **GSAP & Lenis 통합**
6. ✅ **반응형 디자인**
7. ✅ **성능 최적화**

## 개발 서버 실행

```bash
pnpm dev
```

## 빌드

```bash
pnpm build
pnpm start
```

## 주의사항

1. **이미지 경로**: 현재는 외부 S3 URL을 사용하고 있습니다. 로컬 이미지를 사용하려면 `public/` 폴더에 저장하고 경로를 수정하세요.

2. **폰트**: Figtree 폰트가 전역으로 적용되어 있습니다. 다른 페이지에 영향을 주지 않으려면 3D 스크롤 페이지에만 별도의 layout을 만들 수 있습니다.

3. **스크롤 복원**: 페이지 새로고침 시 항상 맨 위로 스크롤됩니다 (`history.scrollRestoration = 'manual'`).

## 트러블슈팅

### 이미지가 로딩되지 않는 경우
- 네트워크 탭에서 이미지 경로 확인
- CORS 정책 확인
- 이미지 파일 이름 형식 확인 (`u1.png`, `u2.png`, ...)

### 스크롤이 부드럽지 않은 경우
- Lenis가 제대로 초기화되었는지 확인
- GSAP ScrollTrigger가 로드되었는지 확인
- 브라우저 콘솔에서 에러 메시지 확인

## 라이선스

원본 HTML 파일의 라이선스를 따릅니다.
