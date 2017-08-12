import React, { Component } from 'react'
import { connect } from 'react-redux';
import { saveMaskDrawing } from '../../actions';
import { drawPencilMask } from '../../utils';
import './MaskCanvas.scss';

const SIDEBAR_WIDTH = 100;
const POINTER_DEFAULT_SIZE = 30;
const clickX = [];
const clickY = [];
const dragging = [];

class MaskCanvas extends Component {
  state = { addingMask: false };

  componentDidMount() {
    this.putPaskOverlay();
  }

  putPaskOverlay() {
    const { width, height } = this.props;

    this.ctx.fillStyle = 'rgba(150, 34, 111, 0.4)';
    this.ctx.rect(0, 0, width, height);
    this.ctx.fill();
  }

  moveMaskPointer(e) {
    const halfPointerSize = POINTER_DEFAULT_SIZE / 2;
    const y = e.pageY - halfPointerSize;
    const x = e.pageX - SIDEBAR_WIDTH - halfPointerSize;

    this.maskPointer.style.top = `${y}px`;
    this.maskPointer.style.left = `${x}px`;
  }

  registerCoordinate = (pageX, pageY, isDragging) => {
    const { offsetLeft, offsetTop } = this.state;
    clickX.push(pageX - offsetLeft);
    clickY.push(pageY - offsetTop);
    dragging.push(isDragging);
  }

  registerStartCoordinates = (e) => {
    this.setState({ addingMask: true });
    this.registerCoordinate(e.pageX, e.pageY);
    this.drawMask();
  }

  registerMoveCoordinates = (e) => {
    if (this.state.addingMask) {
      this.registerCoordinate(e.pageX, e.pageY, true);
      this.drawMask();
    }

    this.moveMaskPointer(e);
  }

  drawMask = () => {
    this.ctx.globalCompositeOperation = 'destination-out';
    drawPencilMask({ ctx: this.ctx, lineWidth: POINTER_DEFAULT_SIZE, clickX, clickY, dragging });
  }

  registerFinishCoordinates = (e) => {
    this.setState({ addingMask: false });
    this.props.saveMaskDrawing({
      clickX,
      clickY,
      dragging,
    });
  }

  saveElementRef = (el) => {
    this.canvasElement = el;
    this.ctx = el.getContext('2d');

    this.setState({
      offsetTop: el.offsetTop,
      offsetLeft: el.offsetLeft + SIDEBAR_WIDTH,
    });
  }

  setPointerRef = (el) => {
    this.maskPointer = el;
  }

  render() {
    const { width, height } = this.props;

    return (
      <div
        className="root"
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        onMouseDown={this.registerStartCoordinates}
        onMouseMove={this.registerMoveCoordinates}
        onMouseUp={this.registerFinishCoordinates}
      >
        <canvas
          className="mask-canvas"
          ref={this.saveElementRef}
          width={width}
          height={height}
        />

        <div
          style={{
            width: `${POINTER_DEFAULT_SIZE}px`,
            height: `${POINTER_DEFAULT_SIZE}px`,
          }}
          ref={this.setPointerRef}
          className="mask-canvas_pointer"
        />
      </div>
    );
  }
}

export default connect(null, { saveMaskDrawing })(MaskCanvas);
