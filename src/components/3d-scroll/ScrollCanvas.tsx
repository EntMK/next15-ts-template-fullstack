"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

interface ScrollCanvasProps {
  frameCount: number;
  folderPath: string;
}

export default function ScrollCanvas({
  frameCount,
  folderPath,
}: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameDataRef = useRef({ frame: 0 });
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 페이지 새로고침 시 무조건 맨 위로 스크롤
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const images: HTMLImageElement[] = [];
    let imagesLoaded = 0;

    // 이미지 프리로드
    function preloadImages() {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = `${folderPath}u${i}.png`;

        img.onload = () => {
          imagesLoaded++;
          const progressPercent = Math.round((imagesLoaded / frameCount) * 100);
          setProgress(progressPercent);

          if (imagesLoaded === frameCount) {
            onAllImagesLoaded();
          }
        };

        img.onerror = () => {
          console.error(`Failed to load: u${i}.png`);
          imagesLoaded++;
          if (imagesLoaded === frameCount) {
            onAllImagesLoaded();
          }
        };

        images.push(img);
      }
    }

    // 모든 이미지 로딩 완료
    function onAllImagesLoaded() {
      console.log("All images loaded!");
      imagesRef.current = images;

      setTimeout(() => {
        setLoading(false);
        setCanvasSize();
        render();
        setupScrollAnimation();
      }, 500);

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1000);
    }

    // Canvas 크기 설정
    function setCanvasSize() {
      const canvas = canvasRef.current;
      if (!canvas || !images[0] || !images[0].complete) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = images[0];
      const windowRatio = window.innerWidth / window.innerHeight;
      const imgRatio = img.width / img.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      let canvasWidth: number, canvasHeight: number;
      if (windowRatio > imgRatio) {
        canvasHeight = window.innerHeight * 0.9;
        canvasWidth = canvasHeight * imgRatio;
      } else {
        canvasWidth = window.innerWidth * 0.9;
        canvasHeight = canvasWidth / imgRatio;
      }

      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;

      ctx.scale(dpr, dpr);
      render();
    }

    // 프레임 렌더링
    function render() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const exactFrame = frameDataRef.current.frame;
      const frameIndex = Math.floor(exactFrame);
      const nextFrameIndex = Math.min(frameIndex + 1, frameCount - 1);
      const frameFraction = exactFrame - frameIndex;

      const displayWidth =
        canvas.width / Math.min(window.devicePixelRatio || 1, 2);
      const displayHeight =
        canvas.height / Math.min(window.devicePixelRatio || 1, 2);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, displayWidth, displayHeight);
      ctx.save();

      if (images[frameIndex]?.complete) {
        ctx.globalAlpha = 1;
        ctx.drawImage(images[frameIndex], 0, 0, displayWidth, displayHeight);

        if (
          frameFraction > 0.2 &&
          images[nextFrameIndex]?.complete
        ) {
          ctx.globalAlpha = frameFraction * 0.15;
          ctx.drawImage(
            images[nextFrameIndex],
            0,
            0,
            displayWidth,
            displayHeight
          );
        }
      }

      ctx.restore();
      setCurrentFrame(frameIndex + 1);
    }

    // Lenis 부드러운 스크롤 초기화
    function initLenis() {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      lenis.on("scroll", () => {
        ScrollTrigger.update();
      });

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    }

    // GSAP 스크롤 애니메이션 설정
    function setupScrollAnimation() {
      initLenis();

      ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: true,
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      });

      gsap.to(frameDataRef.current, {
        frame: frameCount - 1,
        ease: "none",
        scrollTrigger: {
          trigger: "#scroll-spacer",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      gsap.ticker.add(() => {
        render();
      });

      gsap.to("#frame-canvas", {
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: "#scroll-spacer",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      ScrollTrigger.create({
        trigger: "#scroll-spacer",
        start: "bottom bottom",
        onEnter: () => {
          const canvasContainer = document.getElementById("canvas-container");
          if (canvasContainer) {
            canvasContainer.style.position = "absolute";
            canvasContainer.style.top = "auto";
            canvasContainer.style.bottom = "0";
          }

          const vignetteOverlay = document.getElementById("vignette-overlay");
          if (vignetteOverlay) {
            gsap.to(vignetteOverlay, {
              opacity: 0,
              duration: 1,
              onComplete: () => {
                vignetteOverlay.style.display = "none";
              },
            });
          }
        },
        onLeaveBack: () => {
          const canvasContainer = document.getElementById("canvas-container");
          if (canvasContainer) {
            canvasContainer.style.position = "fixed";
            canvasContainer.style.top = "0";
            canvasContainer.style.bottom = "auto";
          }

          const vignetteOverlay = document.getElementById("vignette-overlay");
          if (vignetteOverlay) {
            vignetteOverlay.style.display = "block";
            gsap.to(vignetteOverlay, {
              opacity: 1,
              duration: 1,
            });
          }
        },
      });

      // Scroll Indicator fade
      ScrollTrigger.create({
        trigger: "#scroll-spacer",
        start: "top top",
        end: "top top-=100",
        onEnter: () => {
          const indicator = document.getElementById("scroll-indicator");
          if (indicator) {
            gsap.to(indicator, { opacity: 0, duration: 0.5 });
          }
        },
        onLeaveBack: () => {
          const indicator = document.getElementById("scroll-indicator");
          if (indicator) {
            gsap.to(indicator, { opacity: 1, duration: 0.5 });
          }
        },
      });

      // Fade animations
      const animatedElements = document.querySelectorAll("[data-animation]");
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      }, observerOptions);

      animatedElements.forEach((el) => {
        observer.observe(el);
      });
    }

    // 리사이즈 핸들러
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setCanvasSize();
        ScrollTrigger.refresh();
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    // 초기화
    preloadImages();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [frameCount, folderPath]);

  return (
    <>
      <div id="background" />
      <div className="bubbles" id="bubbles" />

      <div id="title" className={loading ? "hidden" : ""}>
        BIOFOX
      </div>

      {loading && (
        <div id="loading">
          <div>Loading Experience</div>
          <div id="progress-bar">
            <div id="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div id="progress-text">{progress}%</div>
        </div>
      )}

      <div id="canvas-container">
        <canvas ref={canvasRef} id="frame-canvas" />
      </div>

      <div id="vignette-overlay" />

      <div id="scroll-spacer" />

      <div id="scroll-indicator" className={loading ? "hidden" : ""}>
        ↓ SCROLL ↓
      </div>

      <div id="frame-counter" className={loading ? "hidden" : ""}>
        <span id="current-frame">{currentFrame}</span> /{" "}
        <span id="total-frames">{frameCount}</span>
      </div>
    </>
  );
}
