import React from "react";
import handController from "../assets/images/handController.jpg";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero__img">
          <div className="overlay" />
          <div className="contentBlock">
            <h1>MOTION ARCADE</h1>
            <h2>Games that move you</h2>
            <button className="gamesBtn"> To Games</button>
          </div>
        </div>
      </section>
      <section className="keyFeatures">
        <div className="subCard card">
          <div className="card__content">
            <img className="icon2" src="" />
            <h2> Feature 2</h2>
            <h3> Some text describing this subcard and the features</h3>
          </div>
        </div>
        <div className="mainCard card">
          <div className="card__content">
            <img className="icon1" src={handController} />
            <h2> Feature 1</h2>
            <h3> Some text describing the main card and the features</h3>
          </div>
        </div>
        <div className="subCard card">
          <div className="card__content">
            <img className="icon3" src="" />
            <h2> Feature 3</h2>
            <h3> Some text describing this subcard and the features</h3>
          </div>
        </div>
      </section>
    </>
  );
}
