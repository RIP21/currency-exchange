import { combineReducers } from 'redux';

import data from './data';
import wallet from './wallet';

export default combineReducers({
  data,
  wallet
});
