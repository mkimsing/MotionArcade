import React, { Component } from "react";
import Iframe from "react-iframe";
import HandtrackTest from "../components/handtrack_SS";

export default class iframeContainer_ER extends Component {

  //Called every frame by handtracking
  interpretAction = (currentLocation, _prevLocations, currentCanvas) => {
    /**===============================
     * X Position
     ===============================*/
    this.postIframeMsg({
      type: "XPosition",
      percentX: currentLocation.x / currentCanvas.width
    })
  }

  postIframeMsg(msg) {
    if (document.getElementById("spaceShooterIframe")) {

      document.getElementById("spaceShooterIframe").contentWindow.postMessage(msg, "*");
    }
  }

  render() {
    return (
      <section className="iframeContent">
        <Iframe
          url="http://127.0.0.1:5500/client/src/games/spaceShooter/index.html"
          width="800px"
          height="600px"
          id="spaceShooterIframe"
        />
        <HandtrackTest postIframeMsg={this.postIframeMsg}
          interpretAction={this.interpretAction} />
      </section>
    );
  }
}
