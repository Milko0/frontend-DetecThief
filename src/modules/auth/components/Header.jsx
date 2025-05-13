// src/modules/common/components/Header.jsx
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Avatar,
  CircularProgress
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SecurityIcon from '@mui/icons-material/Security';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Obtener la información del usuario actual al cargar el componente
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUserEmail(session.user.email);
        } else {
          // Si no hay sesión activa y no estamos en la página de login, redirigir
          if (!location.pathname.includes('/login')) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getUserInfo();
    
    // Suscribirse a los cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUserEmail(session?.user?.email || null);
      } else if (event === 'SIGNED_OUT') {
        setUserEmail(null);
        navigate('/login');
      }
    });
    
    return () => {
      // Limpiar el listener al desmontar
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, location.pathname]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/perfil');
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleLogoutConfirm = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
    setOpenDialog(false);
  };

  // No mostrar el header en la página de login
  if (location.pathname.includes('/login')) {
    return null;
  }

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          width: '100%', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <SecurityIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Seguridad DT
          </Typography>
          
          {loading ? (
            <CircularProgress color="inherit" size={24} />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {userEmail && (
                <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                  {userEmail}
                </Typography>
              )}
              <Tooltip title="Opciones de usuario">
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  aria-controls="user-menu"
                  aria-haspopup="true"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                    <AccountCircleIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleProfileClick}>
                  <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
                  Mi Perfil
                </MenuItem>
                <MenuItem onClick={handleLogoutClick}>
                  <ExitToAppIcon fontSize="small" sx={{ mr: 1 }} />
                  Cerrar Sesión
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {/* Agregar un espaciador para compensar la barra fija */}
      <Toolbar />

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Confirmar Cierre de Sesión</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            ¿Estás seguro que deseas cerrar sesión?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleLogoutConfirm} color="error" autoFocus>
            Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;