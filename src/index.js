// filename: index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './App';
import 'react-toastify/dist/ReactToastify.css';

const renderApp = () => {
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(
    <Router>
      <App />
    </Router>
  );
};

window.addEventListener('DOMContentLoaded', renderApp);
