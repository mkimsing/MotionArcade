import React from "react";
import IFrameContainer_SS from "../containers/iframeContainer_SS";
import ScoresContainer from "../containers/ScoresContainer";
import keyboardLayout from "../assets/images/keyboard-layout_SS.png"
export default function GamePage_SS() {
  return (
    <div className="gamePage">
      <section className="hero">
        <div className="hero__img">
          <div className="overlay" />
          <div className="contentBlock">
            <h1>Space Shooter</h1>
            <h2>Survive the waves of alien ships!</h2>
          </div>
          <ScoresContainer gameName={'spaceShooter'} />
        </div>
      </section>
      <IFrameContainer_SS />
      <section className="controls">
        <h1> Controls </h1>
        <img src={keyboardLayout} />
      </section>
    </div>
  );
}
