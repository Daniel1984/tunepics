import React from 'react';
import { connect } from 'react-redux';
import './timeline.scss';

const TRIM_HANDLE_WIDTH = 10;
const PLAY_BTN_WIDTH = 40;
const TOOLBAR_WIDTH = 100;
const TRACK_X_POS = TOOLBAR_WIDTH + TRIM_HANDLE_WIDTH + PLAY_BTN_WIDTH;

let trackContainerElement;
let playFrom = 0;

function Timeline(props) {
  function toggleVideo() {
    props.shouldPlay ? props.play(playFrom) : props.pause();
  }

  function getButtonClassName() {
    return props.shouldPlay ? 'timeline_button timeline_button--play' : 'timeline_button timeline_button--pause';
  }

  function savetrackContainerRef(el) {
    trackContainerElement = el;
  }

  function getTotalTrackWidth() {
    return trackContainerElement.clientWidth - TRIM_HANDLE_WIDTH * 2;
  }

  function updateTrackWidth() {
    if (!trackContainerElement) return;

    const width = `${Math.ceil(getTotalTrackWidth() * props.playTrackWidthInPercent / 100)}px`;
    return { width };
  }

  function getExactFrameToStopAt(e) {
    const clickXPos = Math.min(e.clientX - TRACK_X_POS, getTotalTrackWidth());
    const percentageXDistance = clickXPos * 100 / getTotalTrackWidth();
    const totalFrames = props.videoData.length;
    return Math.floor(totalFrames * percentageXDistance / 100);
  }

  function stopAtSelectedFrameFrame(e) {
    playFrom = getExactFrameToStopAt(e);
    props.stopAtFrame(playFrom);
  }

  function playFromSelectedFrame(e) {
    playFrom = getExactFrameToStopAt(e);
    props.play(playFrom);
  }

  function playViedeoFromFrame(e) {
    props.shouldPlay ? stopAtSelectedFrameFrame(e) : playFromSelectedFrame(e);
  }

  return (
    <div className="timeline">
      <div className={getButtonClassName()} onClick={toggleVideo}></div>

      <div ref={savetrackContainerRef} onClick={playViedeoFromFrame} className="timeline_track">
        <div className="timeline_trim-handle timeline_trim-handle--left"></div>
        <div style={updateTrackWidth()} className="timeline_play-track"></div>
        <div className="timeline_trim-handle timeline_trim-handle--right"></div>
      </div>
    </div>
  );
}

function mapStateToProps(state, ownProps) {
  return {
    tool: state.tool,
    videoData: state.videoData
  }
}

export default connect(mapStateToProps)(Timeline);
