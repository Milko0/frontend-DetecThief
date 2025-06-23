// src/modules/auth/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          const response = await fetch(`http://localhost:8080/api/usuarios/by-email/${user.email}`);
          if (response.ok) {
            const userData = await response.json();
            setIsAdmin(userData.rol?.toLowerCase() === 'administrador');
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  const baseMenuItems = [
    { text: 'Principal', icon: <DashboardIcon />, route: '/principal' },
    { text: 'Perfil de Usuario', icon: <PersonIcon />, route: '/perfil' },
    { text: 'Incidentes', icon: <ReportProblemIcon />, route: '/incidentes' },
    { text: 'Mapa', icon: <MapIcon />, route: '/mapa' },
    { text: 'Contacto de Emergencia', icon: <LocalPhoneIcon />, route: '/contacto-emergencia' }
  ];

  const adminMenuItems = [
    { text: 'Registrar Usuario', icon: <PersonAddIcon />, route: '/register' },
    { text: 'Configuración', icon: <SettingsIcon />, route: '/configuracion' }
  ];

  const menuItems = isAdmin ? [...baseMenuItems, ...adminMenuItems] : baseMenuItems;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#B7A8B2',
          color: '#fff',
          mt: '64px',
          pt: 2
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.route)}
              selected={location.pathname === item.route}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
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
