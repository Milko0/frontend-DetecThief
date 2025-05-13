// src/modules/main/pages/PrincipalPage.js
import React from 'react';
import { Box, Container, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import Sidebar from '../components/Sidebar';


const dummyIncidentes = [
  { 
    id: 1, 
    titulo: 'Robo en el laboratorio', 
    descripcion: 'Se reportó un robo en el laboratorio de informática.', 
    fecha: '2025-05-11T09:30:00'
  },
  { 
    id: 2, 
    titulo: 'Puerta forzada', 
    descripcion: 'La puerta del aula 204 fue encontrada forzada.', 
    fecha: '2025-05-10T18:15:00'
  },
];

const PrincipalPage = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 4, ml: '240px' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>Pantalla Principal</Typography>

          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6">Incidentes Recientes</Typography>
            <List>
              {dummyIncidentes.map((inc) => (
                <React.Fragment key={inc.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={inc.titulo}
                      secondary={
                        <>
                          <Typography variant="body2">{inc.descripcion}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Fecha y hora: {new Date(inc.fecha).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Dashboard de Estadísticas</Typography>
            <Box sx={{ mt: 2 }}>
             <img src="/assets/dashboard.png" alt="Dashboard" width="100%" />

            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default PrincipalPage;

