import React from 'react';
import { connect } from 'react-redux';
import './Timeline.scss';

const TRIM_HANDLE_WIDTH = 10;
const PLAY_BTN_WIDTH = 40;
const TOOLBAR_WIDTH = 100;
const TRACK_X_POS = TOOLBAR_WIDTH + TRIM_HANDLE_WIDTH + PLAY_BTN_WIDTH;

let trackContainerElement;
let trackElement;
let playFrom = 0;

function Timeline(props) {
  function savetrackContainerRef(el) {
    trackContainerElement = el;
  }

  function saveTrackRef(el) {
    trackElement = el;
  }

  function getTotalTrackWidth() {
    return trackContainerElement.clientWidth - TRIM_HANDLE_WIDTH * 2;
  }

  function getExactFrameToStopAt(e) {
    const clickXPos = Math.min(e.clientX - TRACK_X_POS, getTotalTrackWidth());
    const percentageXDistance = clickXPos * 100 / getTotalTrackWidth();
    const totalFrames = props.videoData.length;
    return Math.floor(props.videoData.duration * percentageXDistance / 100);
  }

  function stopAtSelectedFrameFrame(e) {
    playFrom = getExactFrameToStopAt(e);
    props.renderFrame(playFrom);
  }

  function playFromSelectedFrame(e) {
    playFrom = getExactFrameToStopAt(e);
    props.play(playFrom);
  }

  function playViedeoFromFrame(e) {
    props.paused ? stopAtSelectedFrameFrame(e) : playFromSelectedFrame(e);
  }

  props.videoData.addEventListener('timeupdate', function() {
    if (!trackContainerElement || !trackElement) return;
    trackElement.style.width = `${Math.ceil(getTotalTrackWidth() * props.videoData.currentTime / props.videoData.duration)}px`;;
  });

  function playVideo() {
    props.play(props.videoData.currentTime);
  }

  function pauseVideo() {
    props.pause();
  }

  return (
    <div className="timeline">
      {props.paused && <div className="timeline_button timeline_button--play" onClick={playVideo}></div>}
      {!props.paused && <div className="timeline_button timeline_button--pause" onClick={pauseVideo}></div>}

      <div ref={savetrackContainerRef} onClick={playViedeoFromFrame} className="timeline_track">
        <div className="timeline_trim-handle timeline_trim-handle--left"></div>
        <div ref={saveTrackRef} className="timeline_play-track"></div>
        <div className="timeline_trim-handle timeline_trim-handle--right"></div>
      </div>
    </div>
  );
}

function mapStateToProps(state, ownProps) {
  return {
    videoData: state.videoData
  }
}

export default connect(mapStateToProps)(Timeline);
