export default function toolReducer(state = {}, action) {
  switch (action.type) {
    case 'DONE_LOADING_VIDEO':
      return action.videoData;
      break;

    default:
      return state;
  }
}
