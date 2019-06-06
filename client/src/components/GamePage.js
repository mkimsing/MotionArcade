import React from "react";
import IFrameContainer from "../containers/iframeContainer";
export default function GamePage() {
  return (
    <div className="gamePage">
      <section className="hero">
        <div className="hero__img">
          <div className="overlay" />
          <div className="contentBlock">
            <h1>Endless Runner</h1>
            <h2>Run till you die!</h2>
          </div>
        </div>
      </section>
      <IFrameContainer />
      <section className="controls">
        <h1> Controls </h1>
        <h3> Keyboard </h3>
        <h4> Left and Right Arrow Keys => Movement </h4>
        <h4> Up Arrow Key => Jump</h4>
      </section>
    </div>
  );
}
