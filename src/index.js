import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'; // Import Provider
import store from './redux/store'; // Import the Redux store
import App from './App';
import './index.css';

ReactDOM.render(
  <Provider store={store}>  {/* Wrap App with Provider */}
    <App />
  </Provider>,
  document.getElementById('root')
);