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
    this.setupStage = this.setupStage.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.renderVideoFrame = this.renderVideoFrame.bind(this);
    this.setCanvasSize = this.setCanvasSize.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);

    this.canvasRAFid;

    this.state = {
      canvasVisible: false,
      filePickerVisible: true,
      paused: true
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

  playVideo(frame = 10) {
    this.setState({ paused: false });
    this.props.videoData.play();

    const ctx = this.getCanvasContext();

    cancelAnimationFrame(this.canvasRAFid);

    this.props.videoData.addEventListener('play', () => {
      this.props.videoData.currentTime = 5;
      let drawToCanvas = () => {
        ctx.drawImage(this.props.videoData, 0, 0, this.canvasElement.width, this.canvasElement.height);
        ctx.font = '48px serif';
        ctx.fillText('Test', 10, 50);
      }

      let play = () => {
        drawToCanvas();
        this.canvasRAFid = requestAnimationFrame(play);

        if (this.props.videoData.ended) {
          cancelAnimationFrame(this.canvasRAFid);
          this.setState({ paused: true });
        }
      }

      play();
    });
  }

  pauseVideo() {
    this.setState({ paused: true });
    this.props.videoData.pause();
    cancelAnimationFrame(this.canvasRAFid);
  }

  renderVideoFrame(frame = 0) {
    this.props.videoData.play();
    this.props.videoData.currentTime = frame;

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
      <section ref={el => this.parentElement = el} className="canvas">
        {this.state.videoProcessing && <Loader message="Processing video. Please wait..." />}
        {this.state.canvasVisible && <canvas ref={el => this.canvasElement = el} className="canvas_renderer"></canvas>}
        {this.state.filePickerVisible && <FileInputField onFileSelected={this.setupStage} message="Choose a video to start..."/>}
        {this.state.canvasVisible && <TimeLine play={this.playVideo} pause={this.pauseVideo} paused={this.state.paused} />}
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
