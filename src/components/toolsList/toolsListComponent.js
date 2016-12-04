import React from 'react'
import { connect } from 'react-redux';
import ToolsItem from '../toolsItem/toolsItemComponent';
import './toolsListStyles.scss';
import CCapture from 'ccapture.js';

const capturer = new CCapture({
  verbose: true,
  framerate: 24,
  quality: 90,
  format: 'webm'
});
capturer.start();

function ToolsList(props) {
  function downloadVideo() {
    props.videoData.play();
    let canvasRAFid;

    cancelAnimationFrame(canvasRAFid);

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = props.videoSize.width;
    offscreenCanvas.height = props.videoSize.height;
    const offscreenCtx = offscreenCanvas.getContext('2d');

    let drawToCanvas = () => {
      offscreenCtx.drawImage(props.videoData, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
      offscreenCtx.font = '48px serif';
      offscreenCtx.fillText('Mr. Retardo', offscreenCanvas.width / 2, offscreenCanvas.height / 2);
      capturer.capture(offscreenCanvas);
    }

    let record = () => {
      drawToCanvas();
      canvasRAFid = requestAnimationFrame(record);

      if (props.videoData.ended) {
        cancelAnimationFrame(canvasRAFid);
        capturer.stop();
        capturer.save();
      }
    }

    record();
  }

  return (
    <section className="tools">
      <div className="tools_title">Tools</div>
      <div className="tools_download-video" onClick={downloadVideo}>Downlaod</div>
    </section>
  );
}

function mapStateToProps(state, ownProps) {
  return {
    videoData: state.videoData,
    videoSize: state.videoSize
  }
}

export default connect(mapStateToProps)(ToolsList);
