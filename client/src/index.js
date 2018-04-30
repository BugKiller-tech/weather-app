import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {cyan500, orange500, deepOrange500, black } from 'material-ui/styles/colors';
import { Provider } from 'react-redux';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


import configureStore from './config/configStore';
const store = configureStore();

const muiTheme = getMuiTheme({
  palette: {
    // textColor: black,
    // primary1Color: orange500,
    // accent1Color: deepOrange500,
  },
  appBar: {
    height: 50,
  },
});



ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
