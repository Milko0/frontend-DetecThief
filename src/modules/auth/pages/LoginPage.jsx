// src/modules/auth/pages/LoginPage.jsx
import React, { useState } from 'react';
import { 
  Button, 
  Typography, 
  TextField, 
  Box, 
  Container, 
  Paper,
  Alert,
  CircularProgress
} from "@mui/material";
import LOGIN_IMG from '../../../assets/imagen_login.svg';
import { supabase } from '../../../supabaseClient.js';
import SecurityIcon from '@mui/icons-material/Security';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
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
      const checkResponse = await fetch(`http://localhost:8080/api/usuarios/check-email?email=${encodeURIComponent(email)}`, {
        method: 'GET'
      }).catch(() => {
        throw new Error('No se pudo conectar con el servidor');
      });

      if (!checkResponse.ok) {
        throw new Error('Este correo no está registrado en el sistema');
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: 'http://localhost:5173/principal',
          shouldCreateUser: false
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccess('Revisa tu correo para el enlace de inicio de sesión');
      setEmail('');
    } catch (e) {
      setError(e.message || 'Error en la autenticación');
      console.error('Login error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ display: 'flex', height: '100vh' }} disableGutters>
      {/* Imagen de la izquierda */}
      <Box sx={{ 
        display: { xs: 'none', md: 'flex' }, 
        bgcolor: '#B7A8B2', 
        width: '50%', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <img src={LOGIN_IMG} alt="login_img" style={{ maxWidth: '100%', width: '400px', height: 'auto' }} />
      </Box>

      {/* Formulario de login */}
      <Box sx={{ 
        width: { xs: '100%', md: '50%' }, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        p: 3
      }}>
        <Paper elevation={3} sx={{ width: '100%', maxWidth: '450px', p: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              Seguridad DT
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ textAlign: "center", mb: 3 }}>
            Iniciar Sesión
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              name="email"
              label="Correo electrónico"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              autoFocus
              autoComplete="email"
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              fullWidth
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Enviar Magic Link'}
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            Se enviará un enlace a tu correo electrónico para iniciar sesión.
            <br />
            Si no tienes una cuenta, contacta con el administrador del sistema.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
