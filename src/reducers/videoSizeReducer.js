export default function toolReducer(state = {}, action) {
  switch (action.type) {
    case 'SET_VIDEO_SIZE':
      return Object.assign({}, action.videoSize)
      break;

    default:
      return state;
  }
}
