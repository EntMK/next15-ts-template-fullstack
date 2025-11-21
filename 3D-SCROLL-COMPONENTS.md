# 3D 스크롤 컴포넌트 사용 가이드

## 📦 컴포넌트 구조

모든 3D 스크롤 섹션이 독립적인 컴포넌트로 분리되어 있어 쉽게 조합하고 재사용할 수 있습니다.

```
src/components/3d-scroll/
├── VideoScroll.tsx          # 비디오 스크롤 컴포넌트
├── StepSections.tsx         # 전체 섹션 통합 (기존)
├── sections/
│   ├── MintSection.tsx      # Step 1: Mint 섹션
│   ├── HatchingSection.tsx  # Step 2: Hatching 섹션
│   ├── TradingSection.tsx   # Step 3: Trading 섹션
│   ├── StaySection.tsx      # Stay with OceanVerse 섹션
│   └── index.ts
└── index.ts
```

## 🚀 사용 방법

### 1. 전체 페이지 사용 (기존 방식)

```tsx
import { StepSections } from "@/components/3d-scroll";

export default function Page() {
  return <StepSections />;
}
```

### 2. 개별 섹션 조합하기

```tsx
import {
  VideoScroll,
  MintSection,
  HatchingSection,
  TradingSection,
  StaySection
} from "@/components/3d-scroll";

export default function CustomPage() {
  return (
    <>
      {/* 비디오 섹션 */}
      <VideoScroll
        videoUrl="/api/proxy?url=https://example.com/video.mp4"
        sectionId="hero"
        className="hero-section"
      />

      {/* Step 섹션들 */}
      <MintSection />
      <HatchingSection />
      <TradingSection />

      {/* 다른 비디오 섹션 */}
      <VideoScroll
        videoUrl="/api/proxy?url=https://example.com/video2.mp4"
        sectionId="featured"
        className="featured-section"
      />

      {/* Stay 섹션 */}
      <StaySection />
    </>
  );
}
```

### 3. 원하는 섹션만 사용하기

```tsx
import { MintSection, TradingSection } from "@/components/3d-scroll";

export default function MinimalPage() {
  return (
    <>
      <MintSection />
      <TradingSection />
    </>
  );
}
```

### 4. 비디오 스크롤만 사용하기

```tsx
import { VideoScroll } from "@/components/3d-scroll";

export default function VideoOnlyPage() {
  return (
    <>
      <VideoScroll
        videoUrl="/path/to/video1.mp4"
        sectionId="section1"
        className="my-custom-class"
      />
      <VideoScroll
        videoUrl="/path/to/video2.mp4"
        sectionId="section2"
        className="my-custom-class"
      />
    </>
  );
}
```

## 🎨 VideoScroll 컴포넌트 Props

| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `videoUrl` | string | ✅ | 비디오 파일 URL (프록시 사용 권장) |
| `sectionId` | string | ✅ | 섹션의 고유 ID |
| `className` | string | ❌ | 추가 CSS 클래스 |

### 비디오 프록시 사용

CORS 문제 해결을 위해 내장 프록시를 사용하세요:

```tsx
<VideoScroll
  videoUrl="/api/proxy?url=https://example.com/video.mp4"
  sectionId="my-video"
/>
```

## ⚙️ 설정

### Lenis 부드러운 스크롤

페이지 컴포넌트에서 Lenis를 초기화하세요:

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Page() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    {/* 컴포넌트들 */}
  );
}
```

### CSS 임포트

```tsx
import "@/styles/3d-scroll.css";
```

## 📝 예제

### 예제 1: 커스텀 순서

```tsx
import {
  VideoScroll,
  HatchingSection,
  MintSection,
  StaySection
} from "@/components/3d-scroll";

export default function CustomOrder() {
  return (
    <>
      <VideoScroll videoUrl="/video1.mp4" sectionId="intro" />
      <HatchingSection />  {/* 순서 변경 */}
      <MintSection />      {/* 순서 변경 */}
      <VideoScroll videoUrl="/video2.mp4" sectionId="outro" />
      <StaySection />
    </>
  );
}
```

### 예제 2: 반복 사용

```tsx
import { MintSection } from "@/components/3d-scroll";

export default function RepeatedSections() {
  return (
    <>
      <MintSection />
      <MintSection />  {/* 같은 섹션 반복 */}
      <MintSection />
    </>
  );
}
```

### 예제 3: 다른 컴포넌트와 조합

```tsx
import { MintSection, VideoScroll } from "@/components/3d-scroll";
import MyHeader from "@/components/MyHeader";
import MyFooter from "@/components/MyFooter";

export default function MixedComponents() {
  return (
    <>
      <MyHeader />
      <MintSection />
      <VideoScroll videoUrl="/video.mp4" sectionId="promo" />
      <div className="my-custom-section">
        <h1>커스텀 콘텐츠</h1>
      </div>
      <MyFooter />
    </>
  );
}
```

## 🎯 최적화 팁

1. **비디오 최적화**: 가능한 작은 파일 크기 사용
2. **Lazy Loading**: 필요한 섹션만 import
3. **프록시 사용**: 외부 비디오는 항상 프록시 사용
4. **Lenis 설정**: smooth scroll로 사용자 경험 향상

## 🔧 트러블슈팅

### 비디오가 끊기는 경우
`VideoScroll.tsx`에서 `scrub` 값 조정:
- 더 부드럽게: `scrub: 2.0`
- 더 빠르게: `scrub: 0.5`

### 스크롤이 불안정한 경우
`end` 값을 증가시키세요:
```tsx
end: "+=600%"  // 기본값: +=500%
```

### CORS 에러
항상 프록시 사용:
```tsx
videoUrl="/api/proxy?url=YOUR_VIDEO_URL"
```
