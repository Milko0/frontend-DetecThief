import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack
} from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Header from '../../auth/components/Header';
import Sidebar from '../../auth/components/Sidebar';

const contactos = [
  {
    nombre: 'Policía Nacional del Perú (PNP)',
    numero: '105',
    descripcion: 'Emergencias policiales a nivel nacional',
  },
  {
    nombre: 'Bomberos Voluntarios del Perú',
    numero: '116',
    descripcion: 'Atención de incendios, rescates y emergencias',
  },
  {
    nombre: 'SAMU - Atención Médica de Urgencia',
    numero: '106',
    descripcion: 'Ambulancias y emergencias médicas prehospitalarias',
  },
  {
    nombre: 'Serenazgo de Lima',
    numero: '0800-20201',
    descripcion: 'Patrullaje y seguridad ciudadana en Lima Metropolitana',
  },
  {
    nombre: 'Defensa Civil - INDECI',
    numero: '119',
    descripcion: 'Mensajes de voz gratuitos en caso de desastres (marcar 119 y seguir instrucciones)',
  },
  {
    nombre: 'Línea 100 - MIMP',
    numero: '100',
    descripcion: 'Atención a víctimas de violencia familiar y sexual',
  },
];

const ContactoEmergenciaPage = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 4, ml: { xs: 0, md: '240px' } }}>
        <Typography variant="h4" gutterBottom>
          Contactos de Emergencia
        </Typography>

        {contactos.map((c, i) => (
          <Card key={i} sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{c.nombre}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>{c.descripcion}</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<LocalPhoneIcon />}
                  href={`tel:${c.numero}`}
                >
                  Llamar al {c.numero}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  </Box>
);

export default ContactoEmergenciaPage;
