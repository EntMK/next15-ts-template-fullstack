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
  const lastTimeRef = useRef<number>(0);
  const targetTimeRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const section = sectionRef.current;

    if (!video || !canvas || !section) return;

    // 모바일 감지
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false,
    });

    if (!ctx) return;

    // 비디오 프리로딩 개선
    video.preload = "auto";
    video.load();

    // 캔버스 크기 설정
    const updateCanvasSize = () => {
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();

    let currentProgress = 0;

    // 비디오 프레임을 캔버스에 그리기
    const drawFrame = () => {
      if (!video || !canvas || !ctx) return;

      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 비디오를 캔버스 크기에 맞춰 그리기 (cover 효과)
      const videoAspect = video.videoWidth / video.videoHeight;
      const canvasAspect = displayWidth / displayHeight;

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
        0, 0, displayWidth, displayHeight
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

      // 비디오 버퍼링 강제 - 더 나은 성능을 위해
      const bufferVideo = async () => {
        try {
          // 비디오의 여러 지점을 미리 로드
          const seekPoints = [0, videoDuration * 0.25, videoDuration * 0.5, videoDuration * 0.75];
          for (const point of seekPoints) {
            video.currentTime = point;
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          video.currentTime = 0;
        } catch (error) {
          console.warn("Video buffering failed:", error);
        }
        drawFrame();
      };

      bufferVideo();

      // GSAP ScrollTrigger 설정 - 부드러운 보간 사용
      const lerp = (start: number, end: number, factor: number) => {
        return start + (end - start) * factor;
      };

      let isUpdating = false;

      const smoothUpdate = () => {
        if (!isUpdating || !video) return;

        const current = video.currentTime;
        const target = targetTimeRef.current;
        const diff = Math.abs(target - current);

        // 큰 점프는 즉시 이동, 작은 차이는 부드럽게 보간
        if (diff > 0.5) {
          video.currentTime = target;
        } else if (diff > 0.001) {
          // lerp factor를 조정해서 더 부드럽게
          const lerpFactor = isMobile ? 0.15 : 0.2;
          video.currentTime = lerp(current, target, lerpFactor);
        }

        requestAnimationFrame(smoothUpdate);
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: isMobile ? "+=400%" : "+=500%",
        pin: true,
        pinSpacing: true,
        scrub: isMobile ? 0.8 : 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        preventOverlaps: true,
        onEnter: () => {
          isUpdating = true;
          smoothUpdate();
        },
        onLeave: () => {
          isUpdating = false;
        },
        onEnterBack: () => {
          isUpdating = true;
          smoothUpdate();
        },
        onLeaveBack: () => {
          isUpdating = false;
        },
        onUpdate: (self) => {
          currentProgress = self.progress;
          targetTimeRef.current = self.progress * (videoDuration - 0.05);
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
          // 추가 최적화 속성
          disablePictureInPicture
          disableRemotePlayback
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          webkit-playsinline="true"
        />
        <div className="video-placeholder" />
      </div>
    </section>
  );
}
