import React, { Component } from "react";
import Iframe from "react-iframe";
import HandtrackTest from "../components/handtrackTest";

export default class iframeContainer extends Component {
  constructor(props) {
    super(props);
    this.events = [new Event("swipeUp")];
  }

  componentDidMount() {
    window.addEventListener(
      "swipeUp",
      e => {
        var frame = document.getElementById("endlessRunnerIframe");
        frame.contentWindow.postMessage("swipeUp", "*");
      },
      false
    );
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
        <HandtrackTest events={this.events} />
      </section>
    );
  }
}
