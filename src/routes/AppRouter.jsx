import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { CircularProgress, Box } from '@mui/material';

// Páginas públicas
import LoginPage from '../modules/auth/pages/LoginPage';
import WelcomePage from '../modules/auth/pages/WelcomePage';

// Páginas protegidas
import RegisterPage from '../modules/auth/pages/RegisterPage';
import ProfilePage from '../modules/auth/pages/ProfilePage';
import PrincipalPage from '../modules/PrincipalPage';
import MapPage from '../modules/auth/pages/MapPage';
import IncidentPage from '../modules/auth/pages/IncidentPendientesPage.jsx';
import IncidentPendientesPage from '../modules/auth/pages/IncidentPendientesPage.jsx'; // ✅ NUEVA
import ConfigurationPage from '../modules/auth/pages/ConfigurationPage';
import ContactoEmergenciaPage from '../modules/auth/pages/ContactoEmergenciaPage';
import IncidentHistorialPage from '../modules/auth/pages/IncidentHistorialPage';


// Componente de ruta protegida
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

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  return children;
};

// Enrutador principal
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/welcome" element={<WelcomePage />} />

        {/* Rutas protegidas */}
        <Route path="/register" element={<ProtectedRoute><RegisterPage /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/principal" element={<ProtectedRoute><PrincipalPage /></ProtectedRoute>} />
        <Route path="/mapa" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/incidentes" element={<ProtectedRoute><IncidentPage /></ProtectedRoute>} />
        <Route path="/incidentes/pendientes" element={<ProtectedRoute><IncidentPendientesPage /></ProtectedRoute>} />
        <Route path="/incidentes/historial" element={<ProtectedRoute><IncidentHistorialPage /></ProtectedRoute>} />

        <Route path="/configuracion" element={<ProtectedRoute><ConfigurationPage /></ProtectedRoute>} />
        <Route path="/contacto-emergencia" element={<ProtectedRoute><ContactoEmergenciaPage /></ProtectedRoute>} />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
