// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { CircularProgress, Box } from '@mui/material';

// Importación de páginas
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
import WelcomePage from './modules/auth/pages/WelcomePage'; // Asumiendo que existe
import ProfilePage from './modules/auth/pages/ProfilePage';
import PrincipalPage from './modules/auth/pages/PrincipalPage';
import MapPage from './modules/auth/pages/MapPage';
import IncidentPage from './modules/auth/pages/IncidentPage';

// Componente protector de rutas
const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    
    checkSession();
    
    // Configurar un listener para cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setLoading(false);
      }
    );
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        
        {/* Rutas protegidas */}
        <Route path="/register" element={
          <ProtectedRoute>
            <RegisterPage />
          </ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/principal" element={
          <ProtectedRoute>
            <PrincipalPage />
          </ProtectedRoute>
        } />
        <Route path="/mapa" element={
          <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>
        } />
        <Route path="/incidentes" element={
          <ProtectedRoute>
            <IncidentPage />
          </ProtectedRoute>
        } />
        
        {/* Redirección para cualquier ruta no definida */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;