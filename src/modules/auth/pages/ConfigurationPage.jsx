import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Container, Typography, Paper, TextField, Button, List, ListItem,
  ListItemText, Divider, Stack, Alert
} from '@mui/material';
import Sidebar from '../components/Sidebar';
import Header from '../../auth/components/Header';

const API_URL = 'https://backend-detecthief.onrender.com/api/cameras';

const ConfigurationPage = () => {q
  const [camaras, setCamaras] = useState([]);
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCamaras();
  }, []);

  const fetchCamaras = async () => {
    try {
      const response = await axios.get(API_URL);
      setCamaras(response.data);
    } catch (error) {
      console.error('Error al obtener cámaras:', error);
      setErrorMessage('Error al obtener cámaras.');
    }
  };

  const agregarCamara = async () => {
    if (!nombre.trim() || !ubicacion.trim()) {
      setErrorMessage('Debes completar los campos nombre y ubicación.');
      setSuccessMessage('');
      return;
    }

    const body = {
      name: nombre.trim(),
      location: ubicacion.trim(),
      description: '',
      urlStream: nombre.trim().toLowerCase()
    };

    try {
      const response = await axios.post(API_URL, body);
      console.log("✅ Cámara guardada:", response.data);
      setNombre('');
      setUbicacion('');
      setErrorMessage('');
      setSuccessMessage('Cámara agregada correctamente ✅');
      fetchCamaras();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('❌ Error al agregar cámara:', error);
      if (error.response?.data) {
        setErrorMessage('Error al agregar la cámara: ' + (error.response.data.message || 'Datos inválidos.'));
      } else {
        setErrorMessage('Error al conectar con el servidor.');
      }
      setSuccessMessage('');
    }
  };

  const quitarCamara = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCamaras();
    } catch (error) {
      console.error('Error al eliminar cámara:', error);
    }
  };

  const desactivarCamara = async (id) => {
    try {
      await axios.post(`${API_URL}/${id}/deactivate`);
      fetchCamaras();
    } catch (error) {
      console.error('Error al desactivar cámara:', error);
    }
  };

  const activarCamara = async (id) => {
    try {
      await axios.post(`${API_URL}/${id}/activate`);
      fetchCamaras();
    } catch (error) {
      console.error('Error al activar cámara:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 4, ml: { xs: 0, md: '240px' } }}>
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>Configuración</Typography>

            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6">Gestionar Cámaras</Typography>

              {errorMessage && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {errorMessage}
                </Alert>
              )}

              {successMessage && (
                <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
                  {successMessage}
                </Alert>
              )}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2} mb={2}>
                <TextField
                  label="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Ubicación"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  fullWidth
                />
                <Button variant="contained" onClick={agregarCamara}>Agregar</Button>
              </Stack>

              <List>
                {camaras.map((cam) => (
                  <React.Fragment key={cam.id}>
                    <ListItem
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            color={cam.status === 'activo' ? 'warning' : 'success'}
                            onClick={() =>
                              cam.status === 'activo'
                                ? desactivarCamara(cam.id)
                                : activarCamara(cam.id)
                            }
                          >
                            {cam.status === 'activo' ? 'Desactivar' : 'Activar'}
                          </Button>
                          <Button color="error" onClick={() => quitarCamara(cam.id)}>
                            Quitar
                          </Button>
                        </Stack>
                      }
                    >
                      <ListItemText
                        primary={`📷 ${cam.name}`}
                        secondary={`Ubicación: ${cam.location} — Estado: ${cam.status}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfigurationPage;


