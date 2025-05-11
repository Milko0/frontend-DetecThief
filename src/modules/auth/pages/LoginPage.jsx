// src/modules/auth/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Button, Typography } from "@mui/material";
import { Box, Container, Stack } from '@mui/system';
import TextField from '@mui/material/TextField';
import LOGIN_IMG from '../../../assets/imagen_login.svg';  // Asegúrate de tener la imagen en la carpeta correcta
import { useNavigate } from "react-router-dom";
import { supabase } from '../../../supabaseClient.js'; // Importamos el cliente de Supabase

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginForm, setIsLoginForm] = useState(true); // Definimos el estado para cambiar entre login y registro
  const [error, setError] = useState('');  // Para manejar el mensaje de error
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validación básica antes de hacer la solicitud al backend
    if (!email ) {
      setError('Por favor ingresa tu correo');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: 'http://localhost:5173/welcome',
          shouldCreateUser: false // Esto evita que se creen usuarios automáticamente  // Redirige al usuario después de hacer clic en el Magic Link
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

  const handleRegister = async (e) => {
    e.preventDefault();
    // Lógica de registro (puedes llamar un servicio similar al login)
    alert("Error en el registro");
  };

  return (
    <Container maxWidth="xl" sx={{ display: 'flex' }} disableGutters>
      {/* Imagen de la izquierda */}
      <Box sx={{ display: 'flex', bgcolor: '#B7A8B2', height: '100vh', width: { xs: '0%', md: '50%' }, justifyContent: 'center', alignItems: 'center' }}>
        <img src={LOGIN_IMG} alt="login_img" style={{ maxWidth: '100%', width: '400px', height: 'auto' }} />
      </Box>

      {/* Formulario de login o registro */}
      <Box sx={{ height: '100vh', width: { xs: '100%', md: '50%' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {
          isLoginForm ?
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
              {error && <Typography sx={{ color: 'red', textAlign: 'center' }}>{error}</Typography>}

              <Stack>
                <Typography sx={{ textAlign: "center", mt: 2 }}>
                  ¿Aún no tienes una cuenta? <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginForm(false); }}>Regístrate aquí</a>
                </Typography> 
              </Stack>
            </Box>
            :
            <Box sx={{ height: '400px', width: '450px', mx: 4 }}>
              <Stack onSubmit={handleRegister} component='form' direction="column" spacing={3}>
                <Typography variant="h4" sx={{ textAlign: "center" }}>Registro</Typography>
                <TextField name="email" label="Correo electrónico" variant="outlined" fullWidth />
                <TextField name="password" type="password" label="Contraseña" variant="outlined" fullWidth />
                <Button type="submit" variant="contained" size="large" sx={{ color: 'white' }}>Registrarme</Button>
              </Stack>
              <Typography sx={{ textAlign: "center", mt: 2 }}>
                ¿Ya tienes una cuenta? <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginForm(true); }}>Inicia sesión aquí</a>
              </Typography>
            </Box>
        }
      </Box>
    </Container>
  );
};

export default LoginPage;