import React, { Component } from 'react'
import { connect } from 'react-redux';
import { doneConvertingVideo, setVideoSize } from '../../actions';
import Loader from '../common/Loader/Loader';
import TimeLine from '../Timeline/Timeline';
import FileInputField from '../FileInputField/FileInputField';
import TollsList from '../ToolsList/ToolsList';
import MaskCanvas from '../MaskCanvas/MaskCanvas';
import { drawPencilMask } from '../../utils';
import './Canvas.scss';

import CCapture from 'ccapture.js';

const capturer = new CCapture({
  framerate: 24,
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
    width: 0,
    height: 0,
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
    this.props.setVideoSize({ width, height });
    this.setState({ width, height });
  }

  playVideo = (frame = 0) => {
    let canvasRAFid = undefined;
    const ctx = this.getCanvasContext();
    const { videoData, maskCoordinates: { clickX, clickY, dragging } } = this.props;
    const { width, height } = this.state;

    videoData.play();

    if (canvasRAFid) {
      cancelAnimationFrame(canvasRAFid);
    }

    const oc = document.createElement('canvas');
    oc.width = width;
    oc.height = height;
    const octx = oc.getContext('2d');

    let drawToCanvas = () => {
      // octx.clearRect(0, 0, width, height);
      octx.drawImage(videoData, 0, 0, width, height);
      octx.save();
      octx.globalCompositeOperation = 'destination-in';

      drawPencilMask({ ctx: octx, lineWidth: 30, clickX, clickY, dragging });

      ctx.drawImage(oc, 0, 0, width, height);
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
    const { width, height } = this.state;

    videoData.play();

    let drawImageFromVideoToCanvas = () => {
      videoData.removeEventListener('timeupdate', drawImageFromVideoToCanvas);
      videoData.pause();
      const ctx = this.getCanvasContext();
      ctx.drawImage(videoData, 0, 0, width, height);
    }

    videoData.addEventListener('timeupdate', drawImageFromVideoToCanvas);
  }

  setupStage = (e) => {
    const file = e.target.files[0];
    const videoElement = document.createElement('video');

    videoElement.muted = true;
    videoElement.src = URL.createObjectURL(file);

    videoElement.addEventListener('loadedmetadata', () => {
      this.props.doneConvertingVideo(videoElement);
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
      width,
      height,
    } = this.state;

    return (
      <div>
        <TollsList downloadVideo={this.playVideo} />

        <section className="canvas">
          {videoProcessing && (
            <Loader message="Processing video. Please wait..." />
          )}

          {canvasVisible && (
            <canvas
              className="canvas_renderer"
              ref={el => this.canvasElement = el}
              width={width}
              height={height}
            />
          )}

          {(this.props.tool === 'addMask') && (
            <MaskCanvas width={width} height={height} />
          )}

          {filePickerVisible && (
            <FileInputField onFileSelected={this.setupStage} message="Choose a video to start..." />
          )}
        </section>
      </div>
    );
  }
}

function mapStateToProps({ tool, videoData, maskCoordinates }) {
  return { videoData, tool, maskCoordinates };
}

export default connect(
  mapStateToProps,
  { setVideoSize, doneConvertingVideo }
)(Canvas);
