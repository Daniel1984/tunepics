export default function toolReducer(state = {}, action) {
  switch (action.type) {
    case 'DONE_CONVERTING_VIDEO':
      return action.videoData;
      break;

    default:
      return state;
  }
}
