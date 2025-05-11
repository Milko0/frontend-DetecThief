import React, { useState } from 'react';
import { Button, Typography } from "@mui/material";
import { Box, Container, Stack } from '@mui/system';
import TextField from '@mui/material/TextField';
import LOGIN_IMG from '../../../assets/imagen_login.svg';
import { useNavigate } from "react-router-dom";
import { supabase } from '../../../supabaseClient.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Por favor ingresa tu correo');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: 'http://localhost:5173/welcome'
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setError('');
        alert('Revisa tu correo para el enlace de login.');
      }
    } catch (err) {
      setError(`Error en el envío del Magic Link: ${err.message}`);
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
        <Box sx={{ height: '400px', width: '450px', mx: 4 }}>
          <Stack onSubmit={handleLogin} component='form' direction="column" spacing={3}>
            <Typography variant="h4" sx={{ textAlign: "center" }}>Iniciar Sesión</Typography>
            <TextField
              name="email"
              label="Correo electrónico"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <Button type="submit" variant="contained" size="large" sx={{ color: 'white' }}>Enviar Magic Link</Button>
          </Stack>

          {/* Mostrar mensaje de error si existe */}
          {error && <Typography sx={{ color: 'red', textAlign: 'center', mt: 2 }}>{error}</Typography>}

          <Stack>
            <Typography sx={{ textAlign: "center", mt: 2 }}>
              ¿Aún no tienes una cuenta? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Regístrate aquí</a>
            </Typography> 
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;