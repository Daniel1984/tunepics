export function drawPencilMask({ ctx, lineWidth, clickX, clickY, dragging }) {
  ctx.strokeStyle = '#df4b26';
  ctx.lineJoin = 'round';
  // ctx.miterLimit = 1;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();

  for (let i = 0; i < clickX.length; i += 1) {
    if (dragging[i]) {
      ctx.moveTo(clickX[i - 1], clickY[i - 1]);
    } else {
      ctx.moveTo(clickX[i] - 1, clickY[i]);
    }

    ctx.lineTo(clickX[i], clickY[i]);
  }

  ctx.closePath();
  ctx.stroke();
}
