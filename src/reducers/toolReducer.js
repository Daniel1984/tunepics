export default function toolReducer(state = {}, action) {
  switch (action.type) {
    case 'SELECT_TOOL':
      return Object.assign({}, action.tool);
      break;

    default:
      return state;
  }
}
