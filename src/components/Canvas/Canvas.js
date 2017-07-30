import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as videoDataActions from '../../actions/videoDataActions';
import * as setVideoSize from '../../actions/videoSizeActions';
import Loader from '../common/Loader/Loader';
import TimeLine from '../Timeline/Timeline';
import FileInputField from '../FileInputField/FileInputField';
import TollsList from '../ToolsList/ToolsList';
import './Canvas.scss';

import CCapture from 'ccapture.js';

const capturer = new CCapture({
  framerate: 23,
  verbose: false,
  format: 'webm'
});

capturer.start();

const LANDSCAPE_MAX_WIDTH = 640;
const PORTRAIT_MAX_HEIGHT = 480;

class Canvas extends Component {
  state = {
    canvasVisible: false,
    filePickerVisible: true,
  };

  getCanvasContext() {
    return this.canvasElement.getContext('2d');
  }

  isLandscapeVideo() {
    const { videoData: { videoWidth, videoHeight } } = this.props;
    return videoWidth > videoHeight;
  }

  getVideoResizeRatio() {
    const { videoData: { videoWidth, videoHeight } } = this.props;

    if (this.isLandscapeVideo()) {
      return LANDSCAPE_MAX_WIDTH / videoWidth;
    }

    return PORTRAIT_MAX_HEIGHT / videoHeight;
  }

  getCanvasDimensions() {
    const { videoData: { videoWidth, videoHeight } } = this.props;
    const ratio = this.getVideoResizeRatio();

    return {
      width: videoWidth * ratio,
      height: videoHeight * ratio
    };
  }

  setCanvasSize = () => {
    const { width, height } = this.getCanvasDimensions();
    this.props.dispatch(setVideoSize.setVideoSize({ width, height }));
    this.canvasElement.width = width;
    this.canvasElement.height = height;
  }

  playVideo = (frame = 0) => {
    console.log('playVideo')
    let canvasRAFid = undefined;
    const ctx = this.getCanvasContext();
    const { videoData } = this.props;

    videoData.play();

    if (canvasRAFid) {
      cancelAnimationFrame(canvasRAFid);
    }

    const oc = document.createElement('canvas');
    oc.width = this.canvasElement.width;
    oc.height = this.canvasElement.height;
    const octx = oc.getContext('2d');

    let drawToCanvas = () => {
      octx.clearRect(0, 0, oc.width, oc.height);
      octx.drawImage(videoData, 0, 0, this.canvasElement.width, this.canvasElement.height);
      octx.save();
      octx.globalCompositeOperation = 'destination-in';
      octx.strokeStyle = "#df4b26";
      octx.lineJoin = "round";
      octx.lineWidth = 20;
      octx.moveTo(50, 50);
      octx.lineTo(300, 200);
      octx.closePath();
      octx.stroke();
      // octx.beginPath();
      // octx.ellipse(310, 270, 35, 125, 1.55, 0, 10);
      // octx.fill();


      ctx.drawImage(oc, 0, 0, this.canvasElement.width, this.canvasElement.height);
      ctx.font = '48px serif';
      ctx.fillText('#AMAZE', 20, 40);
      octx.restore();
      capturer.capture(this.canvasElement);
    }

    play();

    function play() {
      drawToCanvas();

      if (videoData.ended) {
        cancelAnimationFrame(canvasRAFid);

        capturer.stop();
        capturer.save();

        return;
      }

      canvasRAFid = requestAnimationFrame(play);
    }
  }

  renderVideoFrame = (frame = 0) => {
    const { videoData } = this.props;

    videoData.play();

    let drawImageFromVideoToCanvas = () => {
      videoData.removeEventListener('timeupdate', drawImageFromVideoToCanvas);
      videoData.pause();
      const ctx = this.getCanvasContext();
      ctx.drawImage(videoData, 0, 0, this.canvasElement.width, this.canvasElement.height);
    }

    videoData.addEventListener('timeupdate', drawImageFromVideoToCanvas);
  }

  setupStage = (e) => {
    const file = e.target.files[0];
    const videoElement = document.createElement('video');

    videoElement.muted = true;
    videoElement.src = URL.createObjectURL(file);

    videoElement.addEventListener('loadedmetadata', () => {
      this.props.dispatch(videoDataActions.doneConvertingVideo(videoElement));
      this.setState({ canvasVisible: true, filePickerVisible: false });
      this.setCanvasSize();
      this.renderVideoFrame(0);
    });
  }

  render() {
    let {
      videoProcessing,
      canvasVisible,
      filePickerVisible,
    } = this.state;

    return (
      <div>
        <TollsList downloadVideo={this.playVideo} />
        <section className="canvas">
          {videoProcessing && (
            <Loader message="Processing video. Please wait..." />
          )}

          {canvasVisible && (
            <canvas ref={el => this.canvasElement = el} className="canvas_renderer" />
          )}

          {filePickerVisible && (
            <FileInputField onFileSelected={this.setupStage} message="Choose a video to start..." />
          )}
        </section>
      </div>
    );
  }
}

function mapStateToProps({ videoData }) {
  return { videoData };
}

export default connect(mapStateToProps)(Canvas);
