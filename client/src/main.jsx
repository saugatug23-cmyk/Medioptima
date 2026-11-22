import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';


const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
          <App />
    
  </React.StrictMode>,
);
