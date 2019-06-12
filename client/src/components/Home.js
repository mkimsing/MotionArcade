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
                  <h3 className="card__tagLine">Play games using your hand as the controller! </h3>
                  <h3>
                    Using the handtrack.js library we get bounding boxes
                   for hands on the video stream.
                  </h3>
                  <h3>
                    After a bit of math to track hand position across frames we can pass this information to our games!
                  </h3>
                </div>
              </div>
              <div className=" card">
                <div className="card__content">
                  <img className="icon1" src={gameController_img} />
                  <h2> Web Game Development </h2>
                  <h3 className="card__tagLine">
                    Scratch built web games using the Phaser 3 game framework!
                  </h3>
                  <h3>
                    Games for this project were built in Javascript using the open source Phaser 3 HTML5 game framework
                  </h3>
                </div>
              </div>
              <div className="card">
                <div className="card__content">
                  <img className="icon3" src={coding_img} />
                  <h2> React & Express/MySQL</h2>
                  <h3 className="card__tagLine">
                    React front-end, a MySQL DB, with a Node.js/Express server in between
                  </h3>
                  <h3>
                    Component based React SPA with react-router navigation. A Node.js/Express
                    server with dynamic routes to manage scores and leaderboards, connected to a
                    simple MySQL database
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
              <Link to="/endlessRunner" className="playBtn">
                PLAY
              </Link>
            </div>
          </div>
        </section>
        <section className="gameCard">
          <div className="spaceShooterImg">
            <div className="overlay" />
            <div className="contentBlock">
              <h1 className="gameCard__title">Space Shooter</h1>
              <h2>
                Use your hand to fly your ship as you battle waves of alien craft...
              </h2>
              <h2 className="highlight">How many will you defeat?</h2>
              <Link to="/spaceShooter" className="playBtn">
                PLAY
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }
}
