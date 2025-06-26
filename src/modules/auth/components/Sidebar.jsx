import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ReportProblem as ReportProblemIcon,
  Dashboard as DashboardIcon,
  Map as MapIcon,
  PersonAdd as PersonAddIcon,
  LocalPhone as LocalPhoneIcon,
  History as HistoryIcon,
  PendingActions as PendingActionsIcon,
} from '@mui/icons-material';

import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [openIncidentes, setOpenIncidentes] = useState(false);

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

  const toggleIncidentes = () => {
    setOpenIncidentes(!openIncidentes);
  };

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

        {/* Principal */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/principal')}
            selected={location.pathname === '/principal'}
          >
            <ListItemIcon sx={{ color: '#fff' }}><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Principal" />
          </ListItemButton>
        </ListItem>

        {/* Perfil */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/perfil')}
            selected={location.pathname === '/perfil'}
          >
            <ListItemIcon sx={{ color: '#fff' }}><PersonIcon /></ListItemIcon>
            <ListItemText primary="Perfil de Usuario" />
          </ListItemButton>
        </ListItem>

        {/* Incidentes (submenú) */}
        <ListItem disablePadding>
          <ListItemButton onClick={toggleIncidentes}>
            <ListItemIcon sx={{ color: '#fff' }}><ReportProblemIcon /></ListItemIcon>
            <ListItemText primary="Incidentes" />
            {openIncidentes ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        <Collapse in={openIncidentes} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => navigate('/incidentes/pendientes')}
                selected={location.pathname === '/incidentes/pendientes'}
              >
                <ListItemIcon sx={{ color: '#fff' }}><PendingActionsIcon /></ListItemIcon>
                <ListItemText primary="Pendientes" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => navigate('/incidentes/historial')}
                selected={location.pathname === '/incidentes/historial'}
              >
                <ListItemIcon sx={{ color: '#fff' }}><HistoryIcon /></ListItemIcon>
                <ListItemText primary="Historial" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        {/* Mapa */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/mapa')}
            selected={location.pathname === '/mapa'}
          >
            <ListItemIcon sx={{ color: '#fff' }}><MapIcon /></ListItemIcon>
            <ListItemText primary="Mapa" />
          </ListItemButton>
        </ListItem>

        {/* Contacto Emergencia */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/contacto-emergencia')}
            selected={location.pathname === '/contacto-emergencia'}
          >
            <ListItemIcon sx={{ color: '#fff' }}><LocalPhoneIcon /></ListItemIcon>
            <ListItemText primary="Contacto de Emergencia" />
          </ListItemButton>
        </ListItem>

        {/* Admin solo */}
        {isAdmin && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/register')}
                selected={location.pathname === '/register'}
              >
                <ListItemIcon sx={{ color: '#fff' }}><PersonAddIcon /></ListItemIcon>
                <ListItemText primary="Registrar Usuario" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/configuracion')}
                selected={location.pathname === '/configuracion'}
              >
                <ListItemIcon sx={{ color: '#fff' }}><SettingsIcon /></ListItemIcon>
                <ListItemText primary="Configuración" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
