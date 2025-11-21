"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideoScroll from "./VideoScroll";

gsap.registerPlugin(ScrollTrigger);

export default function StepSections() {
  useEffect(() => {
    // Fade animations - Intersection Observer
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

    // Spawn 애니메이션 설정
    const setupSpawnAnimations = () => {
      const step1Spawns = document.querySelectorAll(
        ".step-section:nth-of-type(1) .step__spawn"
      );
      const step2Section = document.querySelector(".step-section:nth-of-type(2)");
      const step3Section = document.querySelector(".step-section:nth-of-type(3)");
      const nftCenter = document.querySelector(".step__nft");

      if (!nftCenter || !step1Spawns.length || !step2Section || !step3Section) {
        return;
      }

      // Step 2의 spawn 배경 요소들
      const hatchSpawns = document.querySelectorAll(
        ".step-section:nth-of-type(2) .step-hatch__spawn"
      );

      // Step 3의 product 위치들
      const products = document.querySelectorAll(".step__product");

      step1Spawns.forEach((spawn, index) => {
        // 중앙 NFT 위치
        const nftRect = nftCenter.getBoundingClientRect();
        const nftCenterX = nftRect.left + nftRect.width / 2;
        const nftCenterY = nftRect.top + nftRect.height / 2;

        // Spawn 아이템의 초기 위치
        const spawnRect = spawn.getBoundingClientRect();
        const spawnCenterX = spawnRect.left + spawnRect.width / 2;
        const spawnCenterY = spawnRect.top + spawnRect.height / 2;

        // Step 2의 spawn 위치
        let step2X = 0;
        let step2Y = 0;

        if (hatchSpawns[index]) {
          const spawnBgRect = hatchSpawns[index].getBoundingClientRect();
          const spawnBgCenterX = spawnBgRect.left + spawnBgRect.width / 2;
          const spawnBgCenterY = spawnBgRect.top + spawnBgRect.height / 2;

          step2X = spawnBgCenterX - spawnCenterX;
          step2Y = spawnBgCenterY - spawnCenterY;
        }

        // Step 1 → Step 2: 원래 위치에서 Step 2로 이동
        gsap.to(spawn, {
          x: step2X,
          y: step2Y,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: step2Section,
            start: "top bottom",
            end: "top center",
            scrub: 2,
          },
        });

        // Step 2 → Step 3: 각 spawn이 2개로 증식하여 상품 위치로 이동
        const productIndex = index * 2; // 0->0,1 / 1->2,3 / 2->4,5

        // 복제본 생성 (Step 3에서만 보이도록)
        const clone1 = spawn.cloneNode(true) as HTMLElement;
        spawn.parentElement?.appendChild(clone1);

        if (products[productIndex]) {
          const product1Rect = products[productIndex].getBoundingClientRect();
          const product1X = product1Rect.left + product1Rect.width / 2 - spawnCenterX;
          const product1Y = product1Rect.top + product1Rect.height / 2 - spawnCenterY;

          // 원본을 첫 번째 상품 위치로
          gsap.fromTo(
            spawn,
            {
              x: step2X,
              y: step2Y,
              scale: 1,
            },
            {
              x: product1X,
              y: product1Y,
              scale: 0.5,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: step3Section,
                start: "top bottom",
                end: "center center",
                scrub: 2,
              },
            }
          );
        }

        if (products[productIndex + 1]) {
          const product2Rect = products[productIndex + 1].getBoundingClientRect();
          const product2X = product2Rect.left + product2Rect.width / 2 - spawnCenterX;
          const product2Y = product2Rect.top + product2Rect.height / 2 - spawnCenterY;

          // clone1을 두 번째 상품 위치로
          gsap.set(clone1, {
            x: step2X,
            y: step2Y,
            scale: 1,
            opacity: 0,
          });

          gsap.to(clone1, {
            x: product2X,
            y: product2Y,
            scale: 0.5,
            opacity: 1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: step3Section,
              start: "top bottom",
              end: "center center",
              scrub: 2,
            },
          });
        }
      });
    };

    // 페이지 로드 후 애니메이션 설정
    const timeoutId = setTimeout(() => {
      setupSpawnAnimations();

      // ScrollTrigger refresh
      ScrollTrigger.refresh();
    }, 1500);

    // 추가 refresh (이미지 로드 후)
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(refreshTimeout);
      observer.disconnect();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* Step 1: Mint */}
      <section className="step-section">
        <div className="step-overflow">
          <div className="step__line container">
            <div className="step__left">
              <div className="step-stroke">
                <div className="step-dot" />
                <div className="step-line" />
              </div>
            </div>
          </div>
        </div>
        <div className="container step__wrap">
          <div className="step__box">
            <h2 className="step__title" data-animation="fade-up">
              Steps
            </h2>
            <div className="step__row">
              <div className="step-item">
                <strong className="step-item__number">1</strong>
                <span className="step-item__date">Start of sales Q4 2022</span>
                <h3 className="step-item__title" data-animation="fade-up">
                  Mint
                </h3>
                <p className="step-item__text" data-animation="fade-up">
                  There are 4 main selling stages: random (fixed price, egg of
                  random rarity), race (fixed price, one egg kind, race for its
                  rarity), pre-sale (different price, egg rarity of choice),
                  public sale.
                </p>
                <a href="#" className="step__btn">
                  <span>Join Community</span>
                </a>
              </div>
              <div className="step__images">
                <div className="step__nft">
                  <svg
                    width="400"
                    height="400"
                    viewBox="0 0 400 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="200"
                      cy="200"
                      r="150"
                      fill="url(#nftGradient)"
                      opacity="0.3"
                    />
                    <circle
                      cx="200"
                      cy="200"
                      r="100"
                      fill="url(#nftGradient2)"
                      opacity="0.4"
                    />
                    <circle
                      cx="200"
                      cy="200"
                      r="50"
                      fill="rgba(200, 200, 220, 0.5)"
                    />
                    <defs>
                      <radialGradient id="nftGradient">
                        <stop offset="0%" stopColor="rgba(150, 150, 200, 0.4)" />
                        <stop
                          offset="100%"
                          stopColor="rgba(100, 100, 150, 0.1)"
                        />
                      </radialGradient>
                      <radialGradient id="nftGradient2">
                        <stop offset="0%" stopColor="rgba(180, 180, 220, 0.5)" />
                        <stop
                          offset="100%"
                          stopColor="rgba(120, 120, 180, 0.2)"
                        />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
                <div className="step__spawn step__spawn--1">
                  <img src="/blue.png" alt="Blue" />
                </div>
                <div className="step__spawn step__spawn--2">
                  <img src="/purple.png" alt="Purple" />
                </div>
                <div className="step__spawn step__spawn--3">
                  <img src="/yellow.png" alt="Yellow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Hatching Day */}
      <section className="step-section">
        <div className="step-overflow">
          <div className="step__line container">
            <div className="step__left">
              <div className="step-stroke">
                <div className="step-line" />
                <div className="step-dot" />
                <div className="step-line" />
              </div>
            </div>
          </div>
        </div>
        <div className="container step__wrap">
          <div className="step__box">
            <div className="step__row">
              <div className="step-item">
                <strong className="step-item__number">2</strong>
                <span className="step-item__date">Start Q1 2023</span>
                <h3 className="step-item__title" data-animation="fade-up">
                  Hatching Day
                </h3>
                <p className="step-item__text" data-animation="fade-up">
                  In the end of all selling stages you can &ldquo;crack&rdquo;
                  an egg, so it turns into a fish. Its rarity depends on the
                  stage you purchased your NFT at.
                </p>
                <a href="#" className="step__btn">
                  <span>Join Community</span>
                </a>
              </div>
              <div className="step__hatch">
                <div className="step-hatch step-hatch--1">
                  <div className="step-hatch__images">
                    <div className="step-hatch__spawn" />
                  </div>
                  <div className="step-hatch__skin">
                    <img src="/skin.png" alt="Version 1.0" />
                  </div>
                </div>
                <div className="step-hatch step-hatch--2">
                  <div className="step-hatch__images">
                    <div className="step-hatch__spawn" />
                  </div>
                  <div className="step-hatch__skin">
                    <img src="/skin.png" alt="Version 2.0" />
                  </div>
                </div>
                <div className="step-hatch step-hatch--3">
                  <div className="step-hatch__images">
                    <div className="step-hatch__spawn" />
                  </div>
                  <div className="step-hatch__skin">
                    <img src="/skin.png" alt="Version 3.0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Trading Platform */}
      <section className="step-section">
        <div className="step-overflow">
          <div className="step__line container">
            <div className="step__left">
              <div className="step-stroke">
                <div className="step-line" />
                <div className="step-dot" />
                <div className="step-line" />
              </div>
            </div>
          </div>
        </div>
        <div className="container step__wrap">
          <div className="step__box">
            <div className="step__row">
              <div className="step-item">
                <strong className="step-item__number">3</strong>
                <span className="step-item__date">Start Q1 2023</span>
                <h3 className="step-item__title" data-animation="fade-up">
                  Trading
                  <br />
                  Platform
                </h3>
                <p className="step-item__text" data-animation="fade-up">
                  Trade your fish & egg NFTs using our in-game trading
                  platform.
                </p>
                <a href="#" className="step__btn">
                  <span>Join Community</span>
                </a>
              </div>
              <div className="step__trade">
                <div className="step__trade-images">
                  <div
                    className="step__product step__product--1"
                    data-animation="fade"
                  >
                    <div className="product-placeholder" />
                  </div>
                  <div
                    className="step__product step__product--2"
                    data-animation="fade"
                  >
                    <div className="product-placeholder" />
                  </div>
                  <div
                    className="step__product step__product--3"
                    data-animation="fade"
                  >
                    <div className="product-placeholder" />
                  </div>
                  <div
                    className="step__product step__product--4"
                    data-animation="fade"
                  >
                    <div className="product-placeholder" />
                  </div>
                  <div
                    className="step__product step__product--5"
                    data-animation="fade"
                  >
                    <div className="product-placeholder" />
                  </div>
                  <div
                    className="step__product step__product--6"
                    data-animation="fade"
                  >
                    <div className="product-placeholder" />
                  </div>
                </div>
                <div className="step__trade-skin">
                  <img src="/product.png" alt="Trading Product" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <VideoScroll
        videoUrl="/api/proxy?url=https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/videos/hero-video.mp4"
        sectionId="hero-section"
        className="hero-section"
      />

      {/* Featured Beauty Products Section */}
      <VideoScroll
        videoUrl="/api/proxy?url=https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/videos/featured-video.mp4"
        sectionId="featured-section"
        className="featured-beauty-section"
      />

      {/* Stay Section */}
      <section className="stay section">
        <div className="stay__inner section-transition">
          <div className="stay__bg" />
          <div className="stay__noise" />
          <div className="stay__fish">
            <div className="stay__sprite" />
          </div>
          <div className="stay__content">
            <div className="stay__ribs">
              <picture>
                <img
                  src="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/ribs.png"
                  alt="Ribs"
                />
              </picture>
            </div>
            <div className="stay__wrap container">
              <h2 className="stay__title">
                Stay with
                <br />
                OceanVerse
              </h2>
              <div className="stay__socials">
                <a
                  className="stay-link stay-link_1"
                  href="https://discord.gg/hM2S4UVCmz"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="stay-link__images">
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/discord.webp, https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/discord@2x.webp 2x"
                      />
                      <img
                        src="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/discord.png"
                        srcSet="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/discord@2x.png 2x"
                        alt="Discord"
                      />
                    </picture>
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/discord-hover.webp, https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/discord-hover@2x.webp 2x"
                      />
                      <img
                        src="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/discord-hover.png"
                        srcSet="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/discord-hover@2x.png 2x"
                        alt="Discord"
                      />
                    </picture>
                  </div>
                </a>
                <a
                  className="stay-link stay-link_2"
                  href="https://medium.com/@oceanversep2e"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="stay-link__images">
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/medium.webp, https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/medium@2x.webp 2x"
                      />
                      <img
                        src="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/medium.png"
                        srcSet="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/medium@2x.png 2x"
                        alt="Medium"
                      />
                    </picture>
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/medium-hover.webp, https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/medium-hover@2x.webp 2x"
                      />
                      <img
                        src="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/medium-hover.png"
                        srcSet="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/medium-hover@2x.png 2x"
                        alt="Medium"
                      />
                    </picture>
                  </div>
                </a>
                <a
                  className="stay-link stay-link_3"
                  href="https://twitter.com/ocean_verse"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="stay-link__images">
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/twitter.webp, https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/twitter@2x.webp 2x"
                      />
                      <img
                        src="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/twitter.png"
                        srcSet="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/twitter@2x.png 2x"
                        alt="Twitter"
                      />
                    </picture>
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/twitter-hover.webp, https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/twitter-hover@2x.webp 2x"
                      />
                      <img
                        src="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/twitter-hover.png"
                        srcSet="https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/twitter-hover@2x.png 2x"
                        alt="Twitter"
                      />
                    </picture>
                  </div>
                </a>
              </div>
              <div className="stay__images">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className={`stay-trash stay-trash--${i}`}>
                    <picture>
                      <source
                        type="image/webp"
                        srcSet={`https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/stay-trash-${i}.webp, https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/stay-trash-${i}@2x.webp 2x`}
                      />
                      <img
                        src={`https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/stay-trash-${i}.png`}
                        srcSet={`https://enterboard-data.s3.ap-northeast-2.amazonaws.com/%EB%B0%94%EC%9D%B4%EC%98%A4%ED%8F%AD%EC%8A%A4/img/stay-trash-${i}@2x.png 2x`}
                        alt="Trash"
                      />
                    </picture>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
