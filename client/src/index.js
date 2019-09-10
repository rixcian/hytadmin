import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';
import initWebp from './initWebp';

import('flag-icon-css/css/flag-icon.min.css');
import('./assets/gaxon-icon/style.css');
import('./assets/theme/css/lite-style-5.min.css');
//import('./assets/responsive-sidebar.js');


// We're trying to find out if browser supports WEBP image format
initWebp();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  {},
  composeEnhancers(
    applyMiddleware(reduxThunk)
  ));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'));