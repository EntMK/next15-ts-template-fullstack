"use client";

export default function HatchingSection() {
  return (
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
  );
}
