// src/modules/auth/pages/WelcomePage.jsx
import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Button, 
  Container, 
  Box, 
  Paper, 
  Avatar,
  Fade, 
  Grow,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from '../../../supabaseClient';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const WelcomePage = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar la sesión actual
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          setUser(session.user);
          
          // Intentar obtener datos de perfil del backend
          try {
            const response = await fetch(`http://localhost:8080/api/users/${session.user.id}`);
            if (response.ok) {
              const profileData = await response.json();
              setUserProfile(profileData);
            }
          } catch (profileError) {
            console.error('Error al cargar perfil:', profileError);
          }
        } else {
          // No hay sesión, redirigir al login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Establecer listener para cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/login');
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Typography variant="h5">Cargando...</Typography>
      </Container>
    );
  }

  return (
    <Fade in={!loading} timeout={800}>
      <Container maxWidth="md" sx={{ textAlign: 'center', marginY: '50px' }}>
        <Grow in={!loading} timeout={1000}>
          <Paper 
            elevation={3} 
            sx={{ 
              padding: 4, 
              borderRadius: 3,
              background: 'linear-gradient(to bottom right, #f7f9fc, #edf2f7)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'primary.main',
                  mb: 2
                }}
              >
                {userProfile?.firstName?.charAt(0) || 
                 user?.email?.charAt(0)?.toUpperCase() || 
                 <PersonIcon fontSize="large" />}
              </Avatar>
            </Box>

            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                background: 'linear-gradient(45deg, #2196f3, #3f51b5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              ¡Bienvenido!
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ my: 3 }}>
              <CheckCircleOutlineIcon 
                color="success" 
                fontSize="large" 
                sx={{ mb: 1 }}
              />
              <Typography variant="h5" sx={{ mb: 1 }}>
                Sesión iniciada correctamente
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Has accedido con el correo: <strong>{user?.email}</strong>
              </Typography>

              {userProfile && (
                <Grow in={true} timeout={1500}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 3, 
                      maxWidth: '400px', 
                      mx: 'auto',
                      mb: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Información de perfil
                    </Typography>
                    <Typography>
                      <strong>Usuario:</strong> {userProfile.username}
                    </Typography>
                    <Typography>
                      <strong>Nombre:</strong> {userProfile.firstName} {userProfile.lastName}
                    </Typography>
                  </Paper>
                </Grow>
              )}
            </Box>

            <Button 
              variant="contained" 
              color="error" 
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ mt: 2 }}
            >
              Cerrar sesión
            </Button>
          </Paper>
        </Grow>
      </Container>
    </Fade>
  );
};

export default WelcomePage;
