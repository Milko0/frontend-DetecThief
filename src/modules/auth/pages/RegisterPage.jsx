import React, { useState } from 'react';
import { Button, Typography, CircularProgress } from "@mui/material";
import { Box, Container, Stack } from '@mui/system';
import TextField from '@mui/material/TextField';
import LOGIN_IMG from '../../../assets/imagen_login.svg';
import { useNavigate } from "react-router-dom";
import { register } from '../services/authService';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState(''); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validaciones básicas
    if (!username || !email || !firstName || !lastName) {
      setError('Por favor, completa todos los campos.');
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
      // Utilizamos la función de authService que ya verifica si el email existe
      const userData = {
        username,
        firstName,
        lastName
      };
      
      const response = await register(email, userData);
      
      if (response.success) {
        setSuccess(response.message);
        
        // Limpiar formulario
        setUsername('');
        setEmail(''); 
        setFirstName('');
        setLastName('');
        
        // Redireccionar al login después de unos segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error inesperado al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ display: 'flex' }} disableGutters>
      {/* Imagen de la izquierda - misma estructura que en LoginPage */}
      <Box sx={{ display: 'flex', bgcolor: '#B7A8B2', height: '100vh', width: { xs: '0%', md: '50%' }, justifyContent: 'center', alignItems: 'center' }}>
        <img src={LOGIN_IMG} alt="register_img" style={{ maxWidth: '100%', width: '400px', height: 'auto' }} />
      </Box>

      {/* Formulario de registro */}
      <Box sx={{ height: '100vh', width: { xs: '100%', md: '50%' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: '450px', mx: 4, my: 4 }}>
          <Stack onSubmit={handleRegister} component="form" direction="column" spacing={3}>
            <Typography variant="h4" sx={{ textAlign: "center" }}>Registro de Usuario</Typography>
            
            <TextField 
              label="Nombre de usuario" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              fullWidth 
              required
              disabled={loading}
            />
            
            <TextField 
              label="Correo electrónico" 
              value={email} 
              type="email" 
              onChange={(e) => setEmail(e.target.value)} 
              fullWidth 
              required
              helperText="Recibirás un correo para confirmar tu cuenta"
              disabled={loading}
              error={!!error && error.includes('correo')}
            />
            
            <TextField 
              label="Nombre" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              fullWidth 
              required
              disabled={loading}
            />
            
            <TextField 
              label="Apellido" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              fullWidth 
              required
              disabled={loading}
            /> 
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
              size="large"
              sx={{ color: 'white' }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </Stack>

          {/* Mostrar mensajes de error o éxito */}
          {error && <Typography sx={{ color: 'red', textAlign: 'center', mt: 2 }}>{error}</Typography>}
          {success && <Typography sx={{ color: 'green', textAlign: 'center', mt: 2 }}>{success}</Typography>}

          {/* Link para volver al login */}
          <Typography sx={{ textAlign: "center", mt: 2 }}>
            ¿Ya tienes una cuenta? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Inicia sesión aquí</a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;