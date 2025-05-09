// src/routes/AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../modules/auth/pages/LoginPage';
import WelcomePage from '../modules/auth/pages/WelcomePage';
import RegisterPage from '../modules/auth/pages/RegisterPage';  // Importar la página de registro

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/register" element={<RegisterPage />} />  {/* Ruta de registro */}
    </Routes>
  </Router>
);

export default AppRouter;
