import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as videoDataActions from '../../actions/videoDataActions';
import Loader from '../common/loader/loaderComponent';
import TimeLine from '../timeline/timelineComponent';
import FileInputField from '../fileInputField/fileInputFieldComponent';
import './canvasStyles.scss';

const LANDSCAPE_MAX_WIDTH = 640;
const PORTRAIT_MAX_HEIGHT = 480;

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.recordVideo = this.recordVideo.bind(this);
    this.playSequence = this.playSequence.bind(this);
    this.stopAtFrame = this.stopAtFrame.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);
    this.setCanvasSize = this.setCanvasSize.bind(this);

    this.state = {
      canvasVisible: false,
      videoProcessing: false,
      filePickerVisible: true,
      shouldPlay: true,
      playTrackWidth: 0
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
    this.canvasElement.width = width;
    this.canvasElement.height = height;
  }

  playVideo() {
    this.props.videoData.play();
    let RAFid;
    const ctx = this.getCanvasContext();

    let drawToCanvas = () => {
      ctx.drawImage(this.props.videoData, 0, 0, this.canvasElement.width, this.canvasElement.height);
      ctx.font = '48px serif';
      ctx.fillText('Test', 10, 50);
    }

    function play() {
      drawToCanvas();
      RAFid = requestAnimationFrame(play);
    }

    RAFid = requestAnimationFrame(play);
  }

  recordVideo(e) {
    const file = e.target.files[0];
    const videoElement = document.createElement('video');
    // videoElement.muted = true;
    videoElement.src = URL.createObjectURL(file);
    videoElement.addEventListener('loadedmetadata', () => {
      this.props.dispatch(videoDataActions.doneConvertingVideo(videoElement));
      this.setState({ canvasVisible: true, filePickerVisible: false });
      this.setCanvasSize();
      this.playVideo();
    });
  }

  playSequence(fromFrame = 0, toFrame = this.props.videoData.length) {
    this.setState({ shouldPlay: false });
    const canvasCtx = this.getCanvasContext();
    let currentFrame = fromFrame;
    let timelineGrowthFactor = 100 / toFrame;

    let imageToRender = (frame) => this.props.videoData[frame];
    let makePlayButtonVisible = () => this.setState({ shouldPlay: true });
    let updatePlayTrackWidth = (playTrackWidth) => this.setState({ playTrackWidth });
    let startRAF = () => this.rafId = requestAnimationFrame(playVideo);
    let cancelRAF = () => cancelAnimationFrame(this.rafId);

    function playVideo() {
      startRAF();

      if (currentFrame == toFrame) {
        cancelRAF();
        makePlayButtonVisible();
        return;
      }

      canvasCtx.putImageData(imageToRender(currentFrame), 0, 0);
      currentFrame++;
      updatePlayTrackWidth(Math.floor(currentFrame * timelineGrowthFactor));
    }

    startRAF();
  }

  stopAtFrame(frame) {
    const playTrackWidth = Math.floor(frame * 100 / this.props.videoData.length);
    this.getCanvasContext().putImageData(this.props.videoData[frame], 0, 0);
    this.setState({ playTrackWidth });
  }

  pauseVideo() {
    cancelAnimationFrame(this.rafId);
    this.setState({ shouldPlay: true });
  }

  render() {
    return (
      <section ref={el => this.parentElement = el} className="canvas">
        {this.state.videoProcessing && <Loader message="Processing video. Please wait..." />}
        {this.state.canvasVisible && <canvas ref={el => this.canvasElement = el} className="canvas_renderer"></canvas>}
        {this.state.filePickerVisible && <FileInputField onFileSelected={this.recordVideo} message="Choose a video to start..."/>}
        {this.state.canvasVisible && <TimeLine play={this.playSequence}
          shouldPlay={this.state.shouldPlay}
          pause={this.pauseVideo}
          playTrackWidthInPercent={this.state.playTrackWidth}
          stopAtFrame={this.stopAtFrame} />}
      </section>
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
