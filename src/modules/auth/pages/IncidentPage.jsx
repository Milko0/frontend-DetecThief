import React from 'react';
import { Box, Container, Typography, Paper, Grid, Button, Divider } from '@mui/material';
import Sidebar from '../components/Sidebar';

const dummyIncidentes = [
  {
    id: 1,
    titulo: 'Robo en la biblioteca',
    descripcion: 'Se detectó un posible robo en la biblioteca central.',
    fecha: '2025-05-10',
    hora: '15:30',
  },
  {
    id: 2,
    titulo: 'Persona no autorizada en el aula 302',
    descripcion: 'Se identificó a un individuo desconocido ingresando al aula.',
    fecha: '2025-05-11',
    hora: '09:45',
  },
];

const IncidentPage = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 4, ml: '240px' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Incidentes Detectados
          </Typography>

          {dummyIncidentes.map((incidente) => (
            <Paper key={incidente.id} sx={{ p: 3, mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6">{incidente.titulo}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {incidente.fecha} - {incidente.hora}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {incidente.descripcion}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    ¿Es realmente un incidente?
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" disabled>Sí</Button>
                    <Button variant="outlined" disabled>No</Button>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ mt: 2 }} />
            </Paper>
          ))}
        </Container>
      </Box>
    </Box>
  );
};

export default IncidentPage;
