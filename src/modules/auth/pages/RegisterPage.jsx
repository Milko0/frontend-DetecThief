// src/modules/auth/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Button, Typography, TextField, Container, CircularProgress } from "@mui/material";
import { Box, Stack } from '@mui/system';
import { supabase } from '../../../supabaseClient';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState(''); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función para generar una contraseña aleatoria segura
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!username || !email || !firstName || !lastName) {
      setError('Por favor, completa todos los campos.');
      setLoading(false);
      return;
    }

    try {
      // Generar contraseña aleatoria para Supabase
      const randomPassword = generateRandomPassword();

      // Registrar usuario en Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: randomPassword, // Se registra con contraseña aleatoria que no necesitará recordar
      });

      if (authError) throw new Error(authError.message);

 
      setSuccess('Usuario registrado exitosamente. Se ha enviado un correo para verificar tu cuenta.');
      
      // Limpiar formulario
      setUsername('');
      setEmail(''); 
      setFirstName('');
      setLastName('');
      
      // Opcional: redireccionar al login después de unos segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error inesperado al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Registro de Usuario
      </Typography>

      <Box sx={{ width: '100%' }}>
        <Stack onSubmit={handleRegister} component="form" direction="column" spacing={3}>
          <TextField 
            label="Nombre de usuario" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            fullWidth 
            required
          />
          <TextField 
            label="Correo electrónico" 
            value={email} 
            type="email" 
            onChange={(e) => setEmail(e.target.value)} 
            fullWidth 
            required
            helperText="Recibirás un correo para confirmar tu cuenta"
          />
          <TextField 
            label="Nombre" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            fullWidth 
            required
          />
          <TextField 
            label="Apellido" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            fullWidth 
            required
          /> 
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </Stack>
      </Box>

      {error && <Typography sx={{ color: 'red', marginTop: '10px' }}>{error}</Typography>}
      {success && <Typography sx={{ color: 'green', marginTop: '10px' }}>{success}</Typography>}
    </Container>
  );
};

export default RegisterPage;