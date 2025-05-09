// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Importa App.jsx
import './index.css';     // Asegúrate de tener estilos básicos
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
