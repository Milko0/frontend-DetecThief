import React from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map'; // ← ícono para el mapa
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Principal', icon: <DashboardIcon />, route: '/principal' },
    { text: 'Perfil de Usuario', icon: <PersonIcon />, route: '/perfil' },
    { text: 'Incidentes', icon: <ReportProblemIcon />, route: '/incidentes' },
    { text: 'Mapa', icon: <MapIcon />, route: '/mapa' }, // ← nuevo item para MapPage
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#B7A8B2',
          color: '#fff',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Seguridad IA
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.route)}>
              <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

