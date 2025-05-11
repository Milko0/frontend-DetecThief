// src/modules/map/pages/MapPage.jsx
import React from 'react';
import { Box, Button, Container, Typography, Paper, Stack } from '@mui/material';
import Sidebar from '../../auth/components/Sidebar'; // ajusta la ruta si es diferente
import mapImg from '../../../assets/mapa.png'; // asegúrate de tener una imagen en assets

const lugares = ['Aula 101', 'Laboratorio de Informática', 'Pasadizo Principal', 'Aula 204', 'Biblioteca'];

const MapPage = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 4, ml: '240px' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>Mapa de la Facultad</Typography>

          <Paper sx={{ display: 'flex', p: 3, mt: 2 }}>
            {/* Sección de botones */}
            <Box sx={{ width: '200px', mr: 4 }}>
              <Typography variant="h6" gutterBottom>Lugares</Typography>
              <Stack spacing={2}>
                {lugares.map((lugar, index) => (
                  <Button key={index} variant="outlined" disabled>
                    {lugar}
                  </Button>
                ))}
              </Stack>
            </Box>

            {/* Imagen del mapa */}
            <Box sx={{ flexGrow: 1 }}>
              <img
                src={mapImg}
                alt="Mapa de la Facultad"
                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
              />
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default MapPage;
