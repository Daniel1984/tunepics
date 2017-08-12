import { combineReducers } from 'redux';

function tool(state = {}, action) {
  switch (action.type) {
    case 'SELECT_TOOL':
      return action.tool;
      break;

    default:
      return state;
  }
}

function videoData(state = {}, action) {
  switch (action.type) {
    case 'DONE_LOADING_VIDEO':
      return action.videoData;
      break;

    default:
      return state;
  }
}

function videoSize(state = {}, action) {
  switch (action.type) {
    case 'SET_VIDEO_SIZE':
      return Object.assign({}, action.videoSize)
      break;

    default:
      return state;
  }
}

function maskCoordinates(state = {}, action) {
  switch (action.type) {
    case 'SAVE_MASK_DRAWING':
      return Object.assign({}, action.maskCoordinates)
      break;

    default:
      return state;
  }
}

export default combineReducers({
  tool,
  videoData,
  videoSize,
  maskCoordinates,
});
