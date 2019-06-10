import React from "react";
import * as handTrack from "handtrackjs";
// const spawn = require("threads").spawn;

export default class handtrackTest extends React.Component {
  constructor(props) {
    super(props);
    this.video = React.createRef();
    this.canvas = React.createRef();
    this.context = null;
    this.model = null;
    this.isVideo = true;
    this.currentLocation = {
      x: 0,
      y: 0
    };
    this.prevLocations = [];
    this.counter = 0;
    this.thread = null;
  }
  componentDidMount() {
    this.context = this.canvas.current.getContext("2d");
    const modelParams = {
      flipHorizontal: true, // flip e.g for video
      maxNumBoxes: 1, // maximum number of boxes to detect
      iouThreshold: 0.5, // ioU threshold for non-max suppression
      scoreThreshold: 0.6 // confidence threshold for predictions.
    };

    // Load the model.
    handTrack.load(modelParams).then(lmodel => {
      // detect objects in the image.
      this.model = lmodel;
      // trackButton.disabled = false
    });
  }

  startVideo = () => {
    handTrack.startVideo(this.video.current).then(status => {
      console.log("Video Started", status);
      if (status) {
        // updateNote.innerText = "Video started. Now tracking"
        this.isVideo = true;
        this.runDetection();
      } else {
        // updateNote.innerText = "Please enable video"
      }
    });
  };

  toggleVideo = () => {
    if (!this.isVideo) {
      this.startVideo();

      this.props.postIframeMsg({
        type: 'enableCameraControls'
      })
    } else {
      handTrack.stopVideo(this.video.current);
      this.isVideo = false;
      this.props.postIframeMsg({
        type: 'disableCameraControls'
      })
      //Unused threading stuff
      if (this.thread) {
        this.thread.kill();
      }
    }
  };

  runDetection = () => {
    if (this.video) {
      this.props.postIframeMsg({
        type: 'enableCameraControls'
      })
    }
    this.model.detect(this.video.current).then(predictions => {
      if (predictions[0]) {
        let x = predictions[0].bbox[0];
        let y = predictions[0].bbox[1];
        this.currentLocation.x = predictions[0].bbox[0];
        this.currentLocation.y = predictions[0].bbox[1];

        let location = {
          x: x,
          y: y
        };

        this.prevLocations.unshift(location);
        this.counter++;
        if (this.counter > 30) {
          this.prevLocations.pop();
        }


        /**===============================
         * Swipe Up
         ===============================*/
        let isSwipeUp = this.prevLocations
          .map(prevLocation => this.currentLocation.y - prevLocation.y)
          .some(difference => difference <= -110);

        if (isSwipeUp) {
          let msg = {
            type: 'swipeUp'
          }
          //Reset previous locations after triggering the action
          this.prevLocations = this.prevLocations.map(_item => location);
          this.props.postIframeMsg(msg)
        }
        /**============================
         * Swipe Right
         =============================*/
        let isSwipeRight = this.prevLocations
          .map(prevLocation => this.currentLocation.x - prevLocation.x)
          .some(difference => difference >= 110);
        if (isSwipeRight) {
          //Reset previous locations after triggering the action
          this.prevLocations = this.prevLocations.map(_item => location);
          this.props.postIframeMsg({ type: 'swipeRight' })
        }
      }

      // this.props.postIframeMsg({
      //   type: "XPosition",
      //   percentX: this.currentLocation.x / this.canvas.current.width
      // })

      this.model.renderPredictions(
        predictions,
        this.canvas.current,
        this.context,
        this.video.current
      );
      if (this.isVideo) {
        requestAnimationFrame(this.runDetection);
      }
    });
  };

  render() {
    return (
      <section className="tracking">
        <button onClick={this.toggleVideo}> Toggle Video </button>
        <video
          className="videobox canvasbox"
          autoPlay="autoplay"
          id="myvideo"
          ref={this.video}
        />
        <canvas id="canvas" className="border canvasbox" ref={this.canvas} />
      </section>
    );
  }
}
