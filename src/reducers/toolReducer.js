export default function toolReducer(state = {}, action) {
  switch (action.type) {
    case 'SELECT_TOOL':
      return action.tool;
      break;

    default:
      return state;
  }
}
