import React from "react";
import IFrameContainer_ER from "../containers/iframeContainer_ER";
import ScoresContainer from "../containers/ScoresContainer";
import keyboardLayout from "../assets/images/keyboard-layout_ER.png"
export default function GamePage_ER() {
  return (
    <div className="gamePage">
      <section className="hero">
        <div className="hero__img">
          <div className="overlay" />
          <div className="contentBlock">
            <h1>Endless Runner</h1>
            <h2>Run till you die!</h2>
          </div>
          <ScoresContainer gameName={'endlessRunner'} />
        </div>
      </section>
      <IFrameContainer_ER />
      <section className="controls">
        <h1> Controls </h1>
        <img src={keyboardLayout} />
      </section>
    </div>
  );
}
