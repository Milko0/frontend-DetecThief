// src/modules/auth/pages/WelcomePage.jsx
import React, { useEffect, useState } from 'react';
import { Typography, Button, Container, Box, Avatar, Paper, CircularProgress, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from '../../../supabaseClient';
import Sidebar from '../components/Sidebar'; // ✅ Asegúrate que la ruta sea correcta

const WelcomePage = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          const { data: userData, error: userError } = await supabase.auth.getUser();
          if (userData) {
            setUserDetails(userData.user);
            setUserData(userData.user.user_metadata || {});
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          const { data: userData } = await supabase.auth.getUser();
          if (userData) {
            setUserDetails(userData.user);
            setUserData(userData.user.user_metadata || {});
          }
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserData(null);
          setUserDetails(null);
          navigate('/login');
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar /> {/* ✅ Sidebar incluido */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, ml: '240px' }}>
        <Container maxWidth="md">
          {user ? (
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem', mb: 2 }}>
                  {userData?.nombre ? userData.nombre[0].toUpperCase() : user.email[0].toUpperCase()}
                </Avatar>
                <Typography variant="h4" sx={{ mb: 1 }}>¡Bienvenido!</Typography>
                {userData?.nombre && userData?.apellido && (
                  <Typography variant="h5" sx={{ mb: 1 }}>{userData.nombre} {userData.apellido}</Typography>
                )}
                {userData?.nickname && (
                  <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>@{userData.nickname}</Typography>
                )}
                <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                  Has iniciado sesión exitosamente con tu correo: <strong>{user.email}</strong>
                </Typography>
                <Divider sx={{ width: '100%', my: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ alignSelf: 'flex-start', mb: 2 }}>
                  Información de la cuenta
                </Typography>
                <Box sx={{ width: '100%', bgcolor: 'background.default', p: 2, borderRadius: 1, mb: 3 }}>
                  <pre style={{ overflow: 'auto', maxHeight: '200px', padding: '10px', fontSize: '0.8rem', width: '100%' }}>
                    {JSON.stringify(userDetails, null, 2)}
                  </pre>
                </Box>
                {userData && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ alignSelf: 'flex-start', mb: 2 }}>
                      Metadatos del usuario
                    </Typography>
                    <Box sx={{ width: '100%', bgcolor: 'background.default', p: 2, borderRadius: 1, mb: 3 }}>
                      <pre style={{ overflow: 'auto', maxHeight: '200px', padding: '10px', fontSize: '0.8rem', width: '100%' }}>
                        {JSON.stringify(userData, null, 2)}
                      </pre>
                    </Box>
                  </>
                )}
                <Button variant="contained" color="primary" onClick={handleLogout} size="large">
                  Cerrar sesión
                </Button>
              </Box>
            </Paper>
          ) : (
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
              Redirigiendo al inicio de sesión...
            </Typography>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default WelcomePage;
