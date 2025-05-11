// src/routes/AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../modules/auth/pages/LoginPage';
import WelcomePage from '../modules/auth/pages/WelcomePage';
import RegisterPage from '../modules/auth/pages/RegisterPage';  // Importar la página de registro
import ProfilePage from '../modules/auth/pages/ProfilePage';
import PrincipalPage from '../modules/auth/pages/PrincipalPage';
import MapPage from '../modules/auth/pages/MapPage';
import IncidentPage from '../modules/auth/pages/IncidentPage';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/register" element={<RegisterPage />} />  {/* Ruta de registro */}
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/mapa" element={<MapPage />} />
      <Route path="/principal" element={<PrincipalPage />} />
      <Route path="/incidentes" element={<IncidentPage />} />
    </Routes>
  </Router>
);

export default AppRouter;
