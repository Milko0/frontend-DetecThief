// src/modules/auth/components/RegisterForm.jsx
import React, { useState } from 'react';
import { Button, Typography } from "@mui/material";
import { Box, Stack } from '@mui/system';
import TextField from '@mui/material/TextField';
import { register } from '../services/authService'; // Importamos la función register

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!email || !password) {
      setError('Por favor ingresa un correo y una contraseña');
      return;
    }

    try {
      const response = await register(email, password);  // Llamamos al servicio de registro
      setSuccess('Usuario registrado exitosamente');
      setError('');
      console.log('Registro exitoso', response);
    } catch (err) {
      setError(`Error en el registro: ${err.message}`);
    }
  };

  return (
    <Box sx={{ height: '400px', width: '450px', mx: 4 }}>
      <Stack onSubmit={handleRegister} component='form' direction="column" spacing={3}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>Registro</Typography>
        <TextField
          name="email"
          label="Correo electrónico"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          name="password"
          type="password"
          label="Contraseña"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" size="large" sx={{ color: 'white' }}>Registrarme</Button>
      </Stack>

      {/* Mostrar mensaje de error si existe */}
      {error && <Typography sx={{ color: 'red', textAlign: 'center' }}>{error}</Typography>}
      {/* Mostrar mensaje de éxito si el registro fue exitoso */}
      {success && <Typography sx={{ color: 'green', textAlign: 'center' }}>{success}</Typography>}
    </Box>
  );
};

export default RegisterForm;
