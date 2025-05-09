// src/modules/auth/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Button, Typography, TextField, Container } from "@mui/material";
import { Box, Stack } from '@mui/system';
import { supabase } from '../../../supabaseClient'; // Asegúrate de tener tu cliente Supabase configurado

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !firstName || !lastName) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      // Genera una contraseña aleatoria segura (solo para uso interno de Supabase)
      const randomPassword = crypto.randomUUID();

      // Registro con Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: randomPassword,
      });

      if (signUpError) {
        setError(signUpError.message);
        setSuccess('');
        return;
      }

      // Guarda los datos adicionales en tu backend
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supabaseId: data.user.id,
          username,
          email,
          firstName,
          lastName,
          role,
        }),
      });

      if (response.ok) {
        setSuccess('Usuario registrado exitosamente. Revisa tu correo.');
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al guardar en backend');
        setSuccess('');
      }
    } catch (err) {
      setError(`Error inesperado: ${err.message}`);
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Registro de Usuario
      </Typography>

      <Box sx={{ width: '100%' }}>
        <Stack onSubmit={handleRegister} component="form" direction="column" spacing={3}>
          <TextField label="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
          <TextField label="Correo electrónico" value={email} type="email" onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
          <TextField label="Apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
          <TextField label="Rol" value={role} onChange={(e) => setRole(e.target.value)} fullWidth />
          <Button type="submit" variant="contained" color="primary">Registrarse</Button>
        </Stack>
      </Box>

      {error && <Typography sx={{ color: 'red', marginTop: '10px' }}>{error}</Typography>}
      {success && <Typography sx={{ color: 'green', marginTop: '10px' }}>{success}</Typography>}
    </Container>
  );
};

export default RegisterPage;