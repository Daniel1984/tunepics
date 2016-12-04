import { combineReducers } from 'redux';
import tool from './toolReducer';
import videoData from './videoDataReducer';
import videoSize from './videoSizeReducer';

const rootReducer = combineReducers({
  tool,
  videoData,
  videoSize
});

export default rootReducer;
