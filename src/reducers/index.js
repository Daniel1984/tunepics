import { combineReducers } from 'redux';
import tool from './toolReducer';
import videoData from './videoDataReducer';

const rootReducer = combineReducers({
  tool,
  videoData
});

export default rootReducer;
