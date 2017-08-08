import React, { Component } from 'react'
import './MaskCanvas.scss';

const SIDEBAR_WIDTH = 100;
const clickX = [];
const clickY = [];
const clickDrag = [];

class MaskCanvas extends Component {
  state = { addingMask: false };

  registerCoordinate = (pageX, pageY, dragging) => {
    const { offsetLeft, offsetTop } = this.state;
    clickX.push(pageX - offsetLeft);
    clickY.push(pageY - offsetTop);
    clickDrag.push(dragging);
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
  }

  drawMask = () => {
    // const { width, height } = this.props;
    // this.ctx.clearRect(0, 0, width, height);
    this.ctx.strokeStyle = 'rgb(150, 34, 111)';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = 20;

    for (let i = 0; i < clickX.length; i += 1) {
      this.ctx.beginPath();

      if (clickDrag[i]) {
        this.ctx.moveTo(clickX[i - 1], clickY[i - 1]);
      } else {
        this.ctx.moveTo(clickX[i] - 1, clickY[i]);
      }

      this.ctx.lineTo(clickX[i], clickY[i]);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }

  registerFinishCoordinates = (e) => {
    this.setState({ addingMask: false });
  }

  saveElementRef = (el) => {
    this.canvasElement = el;
    this.ctx = el.getContext('2d');

    this.setState({
      offsetTop: el.offsetTop,
      offsetLeft: el.offsetLeft + SIDEBAR_WIDTH,
    });
  }

  render() {
    const { width, height } = this.props;

    return (
      <canvas
        className="mask-canvas"
        ref={this.saveElementRef}
        onMouseDown={this.registerStartCoordinates}
        onMouseMove={this.registerMoveCoordinates}
        onMouseUp={this.registerFinishCoordinates}
        width={width}
        height={height}
      />
    )
  }
}

export default MaskCanvas;
