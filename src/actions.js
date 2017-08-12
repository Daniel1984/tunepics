export function selectTool(tool) {
  return { type: 'SELECT_TOOL', tool };
}

export function doneConvertingVideo(videoData) {
  return { type: 'DONE_LOADING_VIDEO', videoData };
}

export function setVideoSize(videoSize) {
  return { type: 'SET_VIDEO_SIZE', videoSize };
}

export function saveMaskDrawing(maskCoordinates) {
  return { type: 'SAVE_MASK_DRAWING', maskCoordinates };
}
