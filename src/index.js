import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Provider as ThemeProvider } from 'rebass';

import 'imports/injectGlobals';

import createStore from 'redux/index';

import App from './App';

import registerServiceWorker from 'registerServiceWorker';

const store = createStore({});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
