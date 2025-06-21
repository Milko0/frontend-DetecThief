import React, { useState } from 'react';
import { 
  Box, Container, Typography, Paper, TextField, Button, List, ListItem, 
  ListItemText, Divider, Stack 
} from '@mui/material';
import Sidebar from '../components/Sidebar';
import Header from '../../auth/components/Header';

const ConfigurationPage = () => {
  const [camaras, setCamaras] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [nuevaCamara, setNuevaCamara] = useState('');
  const [nuevoUsuario, setNuevoUsuario] = useState('');

  const agregarCamara = () => {
    if (nuevaCamara.trim()) {
      setCamaras([...camaras, nuevaCamara.trim()]);
      setNuevaCamara('');
    }
  };

  const quitarCamara = (nombre) => {
    setCamaras(camaras.filter(c => c !== nombre));
  };

  const agregarUsuario = () => {
    if (nuevoUsuario.trim()) {
      setUsuarios([...usuarios, nuevoUsuario.trim()]);
      setNuevoUsuario('');
    }
  };

  const quitarUsuario = (nombre) => {
    setUsuarios(usuarios.filter(u => u !== nombre));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 4, ml: { xs: 0, md: '240px' } }}>
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>Configuración</Typography>

            {/* Gestión de Cámaras */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6">Gestionar Cámaras</Typography>
              <Stack direction="row" spacing={2} mt={2} mb={2}>
                <TextField
                  label="ID o nombre de la cámara"
                  variant="outlined"
                  fullWidth
                  value={nuevaCamara}
                  onChange={(e) => setNuevaCamara(e.target.value)}
                />
                <Button variant="contained" onClick={agregarCamara}>Agregar</Button>
              </Stack>
              <List>
                {camaras.map((cam, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      secondaryAction={
                        <Button color="error" onClick={() => quitarCamara(cam)}>Quitar</Button>
                      }
                    >
                      <ListItemText primary={cam} />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>

            {/* Gestión de Usuarios */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Gestionar Usuarios</Typography>
              <Stack direction="row" spacing={2} mt={2} mb={2}>
                <TextField
                  label="ID o nombre del usuario"
                  variant="outlined"
                  fullWidth
                  value={nuevoUsuario}
                  onChange={(e) => setNuevoUsuario(e.target.value)}
                />
                <Button variant="contained" onClick={agregarUsuario}>Agregar</Button>
              </Stack>
              <List>
                {usuarios.map((user, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      secondaryAction={
                        <Button color="error" onClick={() => quitarUsuario(user)}>Quitar</Button>
                      }
                    >
                      <ListItemText primary={user} />
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
