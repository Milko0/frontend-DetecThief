// src/modules/auth/components/ProfileEditForm.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress, 
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProfileEditForm = ({ userData, userEmail, onProfileUpdate }) => {
  const [nickname, setNickname] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setNickname(userData.nickname || '');
      setNombre(userData.nombre || '');
      setApellido(userData.apellido || '');
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://user-service-p40l.onrender.com/api/usuarios/by-email/${userEmail}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname,
          email: userEmail, // Mantenemos el email sin cambios
          nombre,
          apellido
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el perfil');
      }

      const updatedData = await response.json();
      
      if (onProfileUpdate) {
        onProfileUpdate(updatedData);
      }
      
      setSuccess(true);
      
      // Opcional: redirigir al perfil después de unos segundos
      setTimeout(() => {
        navigate('/perfil');
      }, 2000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccess(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
        Editar Perfil
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nickname"
              variant="outlined"
              fullWidth
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              variant="outlined"
              fullWidth
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={userEmail}
              disabled
              helperText="El correo electrónico no se puede modificar"
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/perfil')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              color="primary"
            >
              {loading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
            </Button>
          </Grid>
        </Grid>
      </form>
      
      <Snackbar open={success} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          ¡Perfil actualizado con éxito!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ProfileEditForm;