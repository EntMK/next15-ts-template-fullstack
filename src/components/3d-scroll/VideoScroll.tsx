"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface VideoScrollProps {
  videoUrl: string;
  sectionId: string;
  className?: string;
}

export default function VideoScroll({ videoUrl, sectionId, className = "" }: VideoScrollProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameIdRef = useRef<number>();

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const section = sectionRef.current;

    if (!video || !canvas || !section) return;

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    if (!ctx) return;

    // 캔버스 크기 설정
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };

    updateCanvasSize();

    let currentProgress = 0;

    // 비디오 프레임을 캔버스에 그리기
    const drawFrame = () => {
      if (!video || !canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 비디오를 캔버스 크기에 맞춰 그리기 (cover 효과)
      const videoAspect = video.videoWidth / video.videoHeight;
      const canvasAspect = canvas.width / canvas.height;

      let sx = 0, sy = 0, sWidth = video.videoWidth, sHeight = video.videoHeight;

      if (canvasAspect > videoAspect) {
        // 캔버스가 더 넓음 - 비디오의 높이를 자르기
        sHeight = video.videoWidth / canvasAspect;
        sy = (video.videoHeight - sHeight) / 2;
      } else {
        // 캔버스가 더 높음 - 비디오의 너비를 자르기
        sWidth = video.videoHeight * canvasAspect;
        sx = (video.videoWidth - sWidth) / 2;
      }

      ctx.drawImage(
        video,
        sx, sy, sWidth, sHeight,
        0, 0, canvas.width, canvas.height
      );

      // requestVideoFrameCallback 사용 (지원되는 경우)
      if ('requestVideoFrameCallback' in video) {
        frameIdRef.current = (video as any).requestVideoFrameCallback(drawFrame);
      } else {
        frameIdRef.current = requestAnimationFrame(drawFrame);
      }
    };

    const handleLoadedMetadata = () => {
      const videoDuration = video.duration;

      if (!videoDuration || isNaN(videoDuration)) {
        console.error("Video duration is invalid");
        return;
      }

      // 초기 프레임 그리기
      video.currentTime = 0;
      drawFrame();

      // GSAP ScrollTrigger 설정
      let animationFrameId: number | null = null;
      let lastUpdateTime = 0;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=500%",
        pin: true,
        pinSpacing: true,
        scrub: 1.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        preventOverlaps: true,
        onUpdate: (self) => {
          currentProgress = self.progress;
          const targetTime = self.progress * (videoDuration - 0.05);
          const now = performance.now();

          // 프레임 드롭 방지를 위한 throttle (16ms ~ 60fps)
          if (now - lastUpdateTime < 16) {
            if (animationFrameId) {
              cancelAnimationFrame(animationFrameId);
            }

            animationFrameId = requestAnimationFrame(() => {
              if (Math.abs(video.currentTime - targetTime) > 0.01) {
                video.currentTime = targetTime;
              }
              lastUpdateTime = performance.now();
            });
          } else {
            if (Math.abs(video.currentTime - targetTime) > 0.01) {
              video.currentTime = targetTime;
            }
            lastUpdateTime = now;
          }
        },
        onRefresh: () => {
          updateCanvasSize();
        },
      });
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    // 리사이즈 핸들러
    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameIdRef.current) {
        if ('requestVideoFrameCallback' in video) {
          (video as any).cancelVideoFrameCallback(frameIdRef.current);
        } else {
          cancelAnimationFrame(frameIdRef.current);
        }
      }
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, [videoUrl]);

  return (
    <section ref={sectionRef} id={sectionId} className={className}>
      <div className="video-scroll-container">
        <canvas ref={canvasRef} className="video-canvas" />
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          style={{ display: "none" }}
        />
        <div className="video-placeholder" />
      </div>
    </section>
  );
}
