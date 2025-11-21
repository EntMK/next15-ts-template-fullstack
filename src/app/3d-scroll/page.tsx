"use client";

import { useEffect } from "react";
import StepSections from "@/components/3d-scroll/StepSections";
import Bubbles from "@/components/3d-scroll/Bubbles";
import "@/styles/3d-scroll.css";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ThreeDScrollPage() {
  useEffect(() => {
    // 모바일 감지
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Lenis 인스턴스 생성 - 부드러운 스크롤
    const lenis = new Lenis({
      duration: isMobile ? 1.0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !isMobile,
      smoothTouch: false, // 모바일 터치는 네이티브 스크롤 사용
      touchMultiplier: 2,
      wheelMultiplier: 1,
    });

    // GSAP과 Lenis 통합
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div
      style={{
        fontFamily:
          "'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "#121314",
        fontWeight: 500,
      }}
    >
      <Bubbles />
      <StepSections />
    </div>
  );
}
