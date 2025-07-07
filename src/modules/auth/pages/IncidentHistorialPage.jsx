import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Tooltip,
  Container,
} from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { obtenerHistorialIncidentes } from '../../auth/services/incidentService';

const IncidentHistorialPage = () => {
  const [historial, setHistorial] = useState([]);

  const cargarHistorial = async () => {
    try {
      const data = await obtenerHistorialIncidentes();
      setHistorial(data);
    } catch (error) {
      console.error('Error al cargar historial de incidentes', error);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 4, ml: { xs: 0, md: '240px' } }}>
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>Historial de Incidentes</Typography>
            <Divider sx={{ mb: 3 }} />

            {historial.length === 0 ? (
              <Typography>No hay historial disponible.</Typography>
            ) : (
              <Grid container spacing={3}>
                {historial.map((item) => (
                  <Grid item xs={12} sm={10} md={6} lg={5} key={item.id}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="primary">
                        #{item.id} - Tipo ID: {item.tipoIncidentId}
                      </Typography>
                      <Typography variant="body2">{item.comentario}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Estado: {item.estadoSistema}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Fecha de Cambio: {new Date(item.fechaCambio).toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Contactos Notificados: {item.contactosNotificados || 'Ninguno'}
                      </Typography>
                      {item.evidencia_referencial && (
                        <Box
                          component="img"
                          src={item.evidencia_referencial}
                          alt="Evidencia"
                          sx={{
                            mt: 1,
                            width: '100%',
                            maxHeight: 200,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default IncidentHistorialPage;
