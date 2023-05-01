// filename: index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './App';
import 'react-toastify/dist/ReactToastify.css';

const renderApp = () => {
  const container = document.getElementById('root');

  ReactDOM.render(
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>,
    container
  );
};

if (document.readyState === 'complete') {
  renderApp();
} else {
  window.addEventListener('DOMContentLoaded', renderApp);
}
