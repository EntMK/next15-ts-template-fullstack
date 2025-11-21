"use client";

export default function TradingSection() {
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
  );
}
