import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as videoDataActions from '../../actions/videoDataActions';
import * as setVideoSize from '../../actions/videoSizeActions';
import Loader from '../common/loader/loaderComponent';
import TimeLine from '../timeline/timelineComponent';
import FileInputField from '../fileInputField/fileInputFieldComponent';
import TollsList from '../toolsList/toolsListComponent';
import './canvasStyles.scss';

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
  constructor(props) {
    super(props);
    this.setupStage = this.setupStage.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.renderVideoFrame = this.renderVideoFrame.bind(this);
    this.setCanvasSize = this.setCanvasSize.bind(this);

    this.canvasRAFid;

    this.state = {
      canvasVisible: false,
      filePickerVisible: true
    }
  }

  getCanvasContext() {
    return this.canvasElement.getContext('2d');
  }

  isLandscapeVideo() {
    return this.props.videoData.videoWidth > this.props.videoData.videoHeight;
  }

  getVideoResizeRatio() {
    if (this.isLandscapeVideo()) {
      return LANDSCAPE_MAX_WIDTH / this.props.videoData.videoWidth;
    }

    return PORTRAIT_MAX_HEIGHT / this.props.videoData.videoHeight;
  }

  getCanvasDimensions() {
    const ratio = this.getVideoResizeRatio();

    return {
      width: this.props.videoData.videoWidth * ratio,
      height: this.props.videoData.videoHeight * ratio
    };
  }

  setCanvasSize() {
    const { width, height } = this.getCanvasDimensions();
    this.props.dispatch(setVideoSize.setVideoSize({ width, height }));
    this.canvasElement.width = width;
    this.canvasElement.height = height;
  }

  playVideo(frame = 0) {
    this.props.videoData.play();

    const ctx = this.getCanvasContext();
    cancelAnimationFrame(this.canvasRAFid);
    const oc = document.createElement('canvas');
    oc.width = this.canvasElement.width;
    oc.height = this.canvasElement.height;
    const octx = oc.getContext('2d');

    let drawToCanvas = () => {
      octx.clearRect(0, 0, oc.width, oc.height);
      octx.drawImage(this.props.videoData, 0, 0, this.canvasElement.width, this.canvasElement.height);
      octx.save();
      octx.globalCompositeOperation = 'destination-in';
      octx.beginPath();
      octx.ellipse(310, 270, 35, 125, 1.55, 0, 10);
      octx.fill();
      ctx.drawImage(oc, 0, 0, this.canvasElement.width, this.canvasElement.height);
      ctx.font = '48px serif';
      ctx.fillText('#AMAZE', 20, 40);
      octx.restore();
      capturer.capture(this.canvasElement);
    }

    let play = () => {
      drawToCanvas();
      this.canvasRAFid = requestAnimationFrame(play);

      if (this.props.videoData.ended) {
        cancelAnimationFrame(this.canvasRAFid);
        capturer.stop();
        capturer.save();
      }
    }

    play();
  }

  renderVideoFrame(frame = 0) {
    this.props.videoData.play();

    let drawImageFromVideoToCanvas = () => {
      this.props.videoData.removeEventListener('timeupdate', drawImageFromVideoToCanvas);
      this.props.videoData.pause();
      const ctx = this.getCanvasContext();
      ctx.drawImage(this.props.videoData, 0, 0, this.canvasElement.width, this.canvasElement.height);
    }

    this.props.videoData.addEventListener('timeupdate', drawImageFromVideoToCanvas);
  }

  setupStage(e) {
    const file = e.target.files[0];
    const videoElement = document.createElement('video');
    window.haha = videoElement;
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
    return (
      <div>
        <TollsList downloadVideo={this.playVideo} />
        <section ref={el => this.parentElement = el} className="canvas">
          {this.state.videoProcessing && <Loader message="Processing video. Please wait..." />}
          {this.state.canvasVisible && <canvas ref={el => this.canvasElement = el} className="canvas_renderer"></canvas>}
          {this.state.filePickerVisible && <FileInputField onFileSelected={this.setupStage} message="Choose a video to start..."/>}
        </section>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    tool: state.tool,
    videoData: state.videoData
  }
}

export default connect(mapStateToProps)(Canvas);
//        {this.state.canvasVisible && <TimeLine renderFrame={this.renderVideoFrame} play={this.playVideo} pause={this.pauseVideo} paused={this.state.paused} />}
