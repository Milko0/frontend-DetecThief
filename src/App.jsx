
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
import WelcomePage from './modules/auth/pages/WelcomePage';
import ProfilePage from './modules/auth/pages/ProfilePage';
import PrincipalPage from './modules/auth/pages/PrincipalPage';
import MapPage from './modules/auth/pages/MapPage';
import IncidentPage from './modules/auth/pages/IncidentPage';

const App = () => (
  <Router>
    <Routes>
      {/* Redirección por defecto a la página de login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/principal" element={<PrincipalPage />} />
      <Route path="/mapa" element={<MapPage />} />
      <Route path="/incidentes" element={<IncidentPage />} />
      {/* Redirección para cualquier ruta no definida */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default App;