import React, { useEffect, useState } from 'react';
import { Typography, Container, Box, Avatar, Paper, CircularProgress, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from '../../../supabaseClient';
import Sidebar from '../components/Sidebar';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      const { data: userResponse, error } = await supabase.auth.getUser();
      if (userResponse?.user) {
        setUser(userResponse.user);
        setUserData(userResponse.user.user_metadata || {});
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 4, ml: '240px' }}>
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '2.5rem', mb: 2 }}>
                {userData?.nombre ? userData.nombre[0].toUpperCase() : user?.email[0].toUpperCase()}
              </Avatar>
              <Typography variant="h5">{userData?.nombre} {userData?.apellido}</Typography>
              {userData?.nickname && (
                <Typography variant="subtitle1" color="text.secondary">@{userData.nickname}</Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>Información de Contacto</Typography>
            <Typography variant="body1"><strong>Email:</strong> {user?.email}</Typography>
            {userData?.telefono && (
              <Typography variant="body1"><strong>Teléfono:</strong> {userData.telefono}</Typography>
            )}

            {userData?.rol && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Rol</Typography>
                <Typography variant="body1">{userData.rol}</Typography>
              </>
            )}

            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Última actualización del perfil: {new Date(user?.updated_at).toLocaleString()}
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default ProfilePage;
