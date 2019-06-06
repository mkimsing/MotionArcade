import React from "react";
import { Link } from "react-router-dom";
import gameController_img from "../assets/icons/game-controller.svg";
import coding_img from "../assets/icons/coding.svg";
import eyeTracking_img from "../assets/icons/eye-tracking.svg";
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.GameOneComponent = React.createRef();
  }

  scrollToMyRef = () => {
    this.GameOneComponent.current.scrollIntoView({ behavior: "smooth" });
  };
  // run this method to execute scrolling.

  render() {
    return (
      <>
        <section className="hero">
          <div className="hero__img">
            <div className="overlay" />
            <div className="contentBlock">
              <h1>MOTION ARCADE</h1>
              <h2>Games that move you</h2>
              <button className="gamesBtn" onClick={this.scrollToMyRef}>
                To Games
              </button>
            </div>
          </div>
        </section>
        <section className="keyFeatures">
          <div className="keyFeatures__content">
            <h1 className="keyFeatures__title"> Project Features </h1>
            <div className="cardContainer">
              <div className="card">
                <div className="card__content">
                  <img className="icon2" src={eyeTracking_img} />
                  <h2> Hand Tracking </h2>
                  <h3>
                    CHANGE ME! Some text describing the feature... Something
                    something using handtrack.js. Built on top of tensorflow.js
                    Uses convoluted neural nets and then magic happens
                    Multithreading here if needed...
                  </h3>
                </div>
              </div>
              <div className=" card">
                <div className="card__content">
                  <img className="icon1" src={gameController_img} />
                  <h2> Web Game Development </h2>
                  <h3>
                    CHANGE ME! Something something Phaser 3 game framework. Open
                    source framework for Canvas and WebGL browser games. Uses JS
                    and HTML 5
                  </h3>
                </div>
              </div>
              <div className="card">
                <div className="card__content">
                  <img className="icon3" src={coding_img} />
                  <h2> React UI & Express Server</h2>
                  <h3>
                    CHANGE ME! Uses React Components for UI and Node.js/Express
                    server to handle scores and leaderboards. NPM,
                    React-router-dom, anything else I can fit here
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="gameCard" ref={this.GameOneComponent}>
          <div className="endlessRunnerImg">
            <div className="overlay" />
            <div className="contentBlock">
              <h1 className="gameCard__title">Endless Runner</h1>
              <h2>
                Using your hand as a controller, run for your life through a
                skeleton infested forest...
              </h2>
              <h2 className="highlight">How long will you last?</h2>
              <Link to="/Game1" className="playBtn">
                PLAY
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }
}
