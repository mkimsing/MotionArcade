import React, { Component } from "react";
import Iframe from "react-iframe";
import HandtrackTest from "../components/handtrack_ER";

export default class iframeContainer_ER extends Component {

  interpretAction = (currentLocation, prevLocations, _currentCanvas) => {
    /**===============================
 * Swipe Up
 ===============================*/
    let isSwipeUp = prevLocations
      .map(prevLocation => currentLocation.y - prevLocation.y)
      .some(difference => difference <= -110);

    if (isSwipeUp) {
      let msg = {
        type: 'swipeUp'
      }
      //Reset previous locations after triggering the action
      prevLocations = prevLocations.map(_item => currentLocation);
      this.postIframeMsg(msg)
    }
    /**============================
     * Swipe Right
     =============================*/
    let isSwipeRight = prevLocations
      .map(prevLocation => currentLocation.x - prevLocation.x)
      .some(difference => difference >= 110);
    if (isSwipeRight) {
      //Reset previous locations after triggering the action
      prevLocations = prevLocations.map(_item => currentLocation);
      this.postIframeMsg({ type: 'swipeRight' })
    }
  }

  postIframeMsg(msg) {
    document.getElementById("endlessRunnerIframe").contentWindow.postMessage(msg, "*");
  }

  render() {
    return (
      <section className="iframeContent">
        <Iframe
          url="http://127.0.0.1:5500/client/src/games/endlessRunner/index.html"
          width="800px"
          height="600px"
          id="endlessRunnerIframe"
        />
        <HandtrackTest postIframeMsg={this.postIframeMsg}
          interpretAction={this.interpretAction} />
      </section>
    );
  }
}
