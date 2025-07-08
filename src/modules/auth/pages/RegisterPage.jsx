// src/modules/auth/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { supabase } from '../../../supabaseClient';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }

        const { data: userResponse } = await supabase.auth.getUser();
        if (userResponse?.user) {
          const response = await fetch(`https://user-service-p40l.onrender.com/api/usuarios/by-email/${userResponse.user.email}`);
          if (response.ok) {
            const userData = await response.json();
            const userIsAdmin = userData.rol?.toLowerCase() === 'administrador';
            setIsAdmin(userIsAdmin);
            if (!userIsAdmin) {
              navigate('/principal');
            }
          } else {
            navigate('/principal');
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/principal');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAdminStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Solo informativo, ya no cerramos sesión
      console.log("Cambio de sesión detectado", event, session);
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!username || !email || !firstName || !lastName) {
      setError('Todos los campos son obligatorios.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      setLoading(false);
      return;
    }

    try {
      const userData = { username, firstName, lastName };
      const response = await register(email, userData);

      if (response.success) {
        setSuccess(response.message);
        setUsername('');
        setEmail('');
        setFirstName('');
        setLastName('');
      } else {
        setError(response.message || 'Error en el registro');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error inesperado al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 4, ml: '240px' }}>
          <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonAddIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h5">Registrar Nuevo Usuario</Typography>
              </Box>

              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Nickname"
                      variant="outlined"
                      fullWidth
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Correo Electrónico"
                      type="email"
                      variant="outlined"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      helperText="Se enviará un magic link a este correo para completar el registro"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Nombre"
                      variant="outlined"
                      fullWidth
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Apellido"
                      variant="outlined"
                      fullWidth
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{ py: 1.5 }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Registrar Usuario'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;