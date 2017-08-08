import React, { Component } from 'react'
import './MaskCanvas.scss';

const SIDEBAR_WIDTH = 100;

class MaskCanvas extends Component {
  state = {
    addingMask: false
  };

  registerStartCoordinates = (e) => {
    this.setState({
      addingMask: true,
      startX: e.pageX,
      startY: e.pageY,
    });
  }

  registerMoveCoordinates = (e) => {
    if (this.state.addingMask) {
      const { width, height } = this.props;
      const { offsetLeft, offsetTop, startX, startY } = this.state;
      const xPos = e.pageX - offsetLeft;
      const yPos = e.pageY - offsetTop;

      // this.ctx.clearRect(0, 0, width, height);
      this.ctx.strokeStyle = "#df4b26";
      this.ctx.lineJoin = "round";
      this.ctx.lineWidth = 5;
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(xPos, yPos);
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
