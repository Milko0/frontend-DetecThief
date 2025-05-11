import React, { useState } from 'react';
import { Button, Typography, CircularProgress, Alert } from "@mui/material";
import { Box, Container, Stack } from '@mui/system';
import TextField from '@mui/material/TextField';
import LOGIN_IMG from '../../../assets/imagen_login.svg';
import { useNavigate } from "react-router-dom";
import { loginWithMagicLink } from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validación básica del formato de correo electrónico
    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      setLoading(false);
      return;
    }

    // Validación simple del formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      setLoading(false);
      return;
    }

    try {
      // Utilizamos la función mejorada de authService que verifica si el email existe
      const response = await loginWithMagicLink(email);
      
      if (response.success) {
        setSuccess(response.message);
        setEmail(''); // Limpiamos el campo después de enviar
      } else {
        // Si no fue exitoso pero tenemos un mensaje (ej: correo no registrado)
        setError(response.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // Función para registrarse si el correo no existe
  const handleRedirectToRegister = () => {
    // Si hay un correo válido, podemos pasarlo a la página de registro como un parámetro de estado
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      navigate('/register', { state: { email } });
    } else {
      navigate('/register');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ display: 'flex' }} disableGutters>
      {/* Imagen de la izquierda */}
      <Box sx={{ display: 'flex', bgcolor: '#B7A8B2', height: '100vh', width: { xs: '0%', md: '50%' }, justifyContent: 'center', alignItems: 'center' }}>
        <img src={LOGIN_IMG} alt="login_img" style={{ maxWidth: '100%', width: '400px', height: 'auto' }} />
      </Box>

      {/* Formulario de login */}
      <Box sx={{ height: '100vh', width: { xs: '100%', md: '50%' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ height: 'auto', width: '450px', mx: 4 }}>
          <Stack onSubmit={handleLogin} component='form' direction="column" spacing={3}>
            <Typography variant="h4" sx={{ textAlign: "center" }}>Iniciar Sesión</Typography>
            <TextField
              name="email"
              label="Correo electrónico"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              error={!!error && (error.includes('correo') || error.includes('registrado'))}
              helperText="Ingresa el correo con el que te registraste"
              disabled={loading}
            />
            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              sx={{ color: 'white' }}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Verificando...' : 'Enviar Magic Link'}
            </Button>
          </Stack>

          {/* Mostrar mensaje de error con opción de registro */}
          {error && error.includes('no está registrado') && (
            <Alert 
              severity="warning" 
              sx={{ mt: 2 }}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={handleRedirectToRegister}
                >
                  Registrarme
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Otros errores */}
          {error && !error.includes('no está registrado') && (
            <Typography sx={{ color: 'red', textAlign: 'center', mt: 2 }}>{error}</Typography>
          )}

          {/* Mensaje de éxito */}
          {success && <Typography sx={{ color: 'green', textAlign: 'center', mt: 2 }}>{success}</Typography>}

          <Stack>
            <Typography sx={{ textAlign: "center", mt: 2 }}>
              ¿Aún no tienes una cuenta? <a href="#" onClick={(e) => { e.preventDefault(); handleRedirectToRegister(); }}>Regístrate aquí</a>
            </Typography>
            <Typography sx={{ mt: 2, textAlign: "center" }}>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>¿Olvidaste tu contraseña?</a>
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;