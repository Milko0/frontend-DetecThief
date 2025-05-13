import React, { useState } from 'react';
import { Box, Button, Container, Typography, Paper, Stack } from '@mui/material';
import Sidebar from '../../auth/components/Sidebar';
import mapImg from '../../../assets/mapa.png';

// Coordenadas ficticias para cada lugar (en porcentaje relativo al mapa)
const lugares = [
  { nombre: 'Aula 101', x: '20%', y: '30%' },
  { nombre: 'Laboratorio de Informática', x: '60%', y: '40%' },
  { nombre: 'Pasadizo Principal', x: '35%', y: '60%' },
  { nombre: 'Aula 204', x: '70%', y: '20%' },
  { nombre: 'Biblioteca', x: '50%', y: '75%' },
];

const MapPage = () => {
  const [lugarSeleccionado, setLugarSeleccionado] = useState(null);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 4, ml: { xs: 0, md: '240px' } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>Mapa de la Facultad</Typography>

          <Paper sx={{ display: 'flex', p: 3, mt: 2, position: 'relative' }}>
            {/* Botones de selección */}
            <Box sx={{ width: '200px', mr: 4 }}>
              <Typography variant="h6" gutterBottom>Cámaras</Typography>
              <Stack spacing={2}>
                {lugares.map((lugar, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    onClick={() => setLugarSeleccionado(lugar)}
                  >
                    {lugar.nombre}
                  </Button>
                ))}
              </Stack>
            </Box>

            {/* Mapa con marcador */}
            <Box sx={{ flexGrow: 1, position: 'relative' }}>
              <img
                src={mapImg}
                alt="Mapa de la Facultad"
                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
              />
              {lugarSeleccionado && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: lugarSeleccionado.y,
                    left: lugarSeleccionado.x,
                    transform: 'translate(-50%, -50%)',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: 'red',
                    border: '2px solid white',
                    zIndex: 10,
                  }}
                />
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default MapPage;
