// src/modules/common/components/Header.jsx
import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Menu, MenuItem,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Tooltip, Avatar, CircularProgress, Box, Button
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email);
      } else if (!location.pathname.includes('/login')) {
        navigate('/login');
      }
      setLoading(false);
    };
    fetchUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') navigate('/login');
      setUserEmail(session?.user?.email || null);
    });
    return () => authListener?.subscription?.unsubscribe();
  }, [location.pathname, navigate]);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const getInitial = () => userEmail?.charAt(0)?.toUpperCase() || '?';

  const confirmLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
    setOpenDialog(false);
  };

  if (location.pathname.includes('/login')) return null;

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#00274D', zIndex: 1300 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="img" src="/src/assets/logo-unmsm.gif" alt="UNMSM" sx={{ height: 40, mr: 2 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                UNMSM – Facultad de Ingeniería de Sistemas
              </Typography>
              <Typography variant="body2" sx={{ color: '#fff' }}>
                Sistema de Detección de Incidentes | Seguridad DT
              </Typography>
            </Box>
          </Box>

          {loading ? <CircularProgress color="inherit" size={24} /> : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#fff', mr: 2 }}>
                {userEmail}
              </Typography>
              <Tooltip title="Mi perfil">
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  <Avatar sx={{ bgcolor: '#005cb2', width: 32, height: 32 }}>{getInitial()}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { navigate('/perfil'); handleMenuClose(); }}>
                  <AccountCircleIcon sx={{ mr: 1 }} /> Mi Perfil
                </MenuItem>
                <MenuItem onClick={() => { setOpenDialog(true); handleMenuClose(); }}>
                  <ExitToAppIcon sx={{ mr: 1 }} /> Cerrar Sesión
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>¿Cerrar sesión?</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Deseas salir del sistema de seguridad?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={confirmLogout} color="error" variant="contained">Cerrar Sesión</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
