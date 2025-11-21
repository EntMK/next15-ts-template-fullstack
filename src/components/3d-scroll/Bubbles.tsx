"use client";

import { useEffect, useRef } from "react";

export default function Bubbles() {
  const bubblesContainerRef = useRef<HTMLDivElement>(null);
  const bubblesCreatedRef = useRef(false);

  useEffect(() => {
    // 이미 생성되었으면 중복 방지
    if (bubblesCreatedRef.current) return;
    bubblesCreatedRef.current = true;

    const bubblesContainer = bubblesContainerRef.current;
    if (!bubblesContainer) return;

    // 기존 bubble과 스타일 제거 (새로고침 시 중복 방지)
    bubblesContainer.innerHTML = "";

    // 기존 bubble 애니메이션 스타일 제거
    const oldStyles = document.querySelectorAll(
      "style[data-bubble-animation]"
    );
    oldStyles.forEach((style) => style.remove());

    const bubbleCount = 40;

    // 모든 애니메이션을 하나의 스타일 시트에 모아서 추가
    let allKeyframes = "";

    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement("div");
      bubble.className = "bubble";

      // 랜덤 크기 (1px ~ 5px)
      const bubbleSize = Math.random() * 4 + 1; // 1px ~ 5px
      bubble.style.width = bubbleSize + "px";
      bubble.style.height = bubbleSize + "px";

      // 랜덤 시작 위치
      const startX = Math.random() * 200 - 100; // -100vw ~ 100vw
      const startY = Math.random() * 200 - 100; // -100vh ~ 100vh

      // 랜덤 애니메이션 속성
      const duration = Math.random() * 100 + 80; // 80s ~ 180s
      const delay = Math.random() * 10; // 0 ~ 10s
      const scaleStart = Math.random() * 0.5 + 0.5; // 0.5 ~ 1.0

      // 랜덤 이동 경로
      const path = [];
      for (let j = 0; j < 5; j++) {
        path.push({
          x: Math.random() * 100 - 50, // -50vw ~ 50vw
          y: Math.random() * 100 - 50, // -50vh ~ 50vh
          scale: Math.random() * 0.8 + 0.3, // 0.3 ~ 1.1
        });
      }

      // 커스텀 애니메이션 생성
      const animationName = `bubble-move-${i}`;
      const opacity1 = Math.random() * 0.4 + 0.2; // 0.2 ~ 0.6
      const opacity2 = Math.random() * 0.4 + 0.2;

      allKeyframes += `
                @keyframes ${animationName} {
                    0% { transform: translate(${startX}vw, ${startY}vh) scale(${scaleStart}); opacity: 0; }
                    10% { opacity: ${opacity1}; }
                    25% { transform: translate(${path[0].x}vw, ${path[0].y}vh) scale(${path[0].scale}); }
                    50% { transform: translate(${path[1].x}vw, ${path[1].y}vh) scale(${path[1].scale}); }
                    75% { transform: translate(${path[2].x}vw, ${path[2].y}vh) scale(${path[2].scale}); }
                    90% { opacity: ${opacity2}; }
                    100% { transform: translate(${path[3].x}vw, ${path[3].y}vh) scale(${path[3].scale}); opacity: 0; }
                }
            `;

      // bubble에 애니메이션 적용
      bubble.style.animation = `${animationName} ${duration}s ease-in-out ${delay}s infinite alternate`;

      bubblesContainer.appendChild(bubble);
    }

    // 모든 애니메이션을 한 번에 추가
    const styleElement = document.createElement("style");
    styleElement.setAttribute("data-bubble-animation", "true");
    styleElement.textContent = allKeyframes;
    document.head.appendChild(styleElement);

    // bubbles 표시
    setTimeout(() => {
      bubblesContainer.classList.add("bubbles_show");
    }, 1000);
  }, []);

  return <div ref={bubblesContainerRef} className="bubbles" id="bubbles" />;
}
