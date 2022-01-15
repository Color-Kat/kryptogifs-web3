import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { TransactionProider } from './context/TransactionContext';

ReactDOM.render(
  <React.StrictMode>
    <TransactionProider>
      <App />
    </TransactionProider>
  </React.StrictMode>,
  document.getElementById('root')
)
