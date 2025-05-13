import React from 'react';
import { Box, Container, Typography, Paper, Grid, Button, Divider } from '@mui/material';
import Sidebar from '../components/Sidebar';
import roboImg from '../../../assets/robo.jpg'; // Asegúrate que esta ruta sea correcta

const IncidentPage = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 4, ml: { xs: 0, md: '240px' } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Incidentes Detectados
          </Typography>

          <Paper sx={{ p: 3, mb: 4 }}>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
              textAlign="center"
            >
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={roboImg}
                    alt="Incidente Robo"
                    style={{ width: '25%', minWidth: 150, height: 'auto', borderRadius: 8 }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  ¿Es realmente un incidente?
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button variant="outlined" disabled>Sí</Button>
                  <Button variant="outlined" disabled>No</Button>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ mt: 2 }} />
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default IncidentPage;


