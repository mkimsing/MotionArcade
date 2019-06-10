import React, { Component } from "react";
import Iframe from "react-iframe";
import HandtrackTest from "../components/handtrackTest";

export default class iframeContainer extends Component {
  constructor(props) {
    super(props);
    this.events = [new Event("swipeUp")];
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
        <HandtrackTest events={this.events} postIframeMsg={this.postIframeMsg} />
      </section>
    );
  }
}
