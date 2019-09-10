import { combineReducers } from 'redux';

import authReducer from './authReducer';
import sidebarReducer from './sidebarReducer';

export default combineReducers({
  auth: authReducer,
  sidebar: sidebarReducer
});