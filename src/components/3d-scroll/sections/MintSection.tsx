"use client";

export default function MintSection() {
  return (
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
  );
}
