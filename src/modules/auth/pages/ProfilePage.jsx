// src/modules/auth/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Container, 
  Box, 
  Avatar, 
  Paper, 
  CircularProgress, 
  Divider, 
  Button,
  Tabs,
  Tab
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from '../../../supabaseClient';
import Sidebar from '../components/Sidebar';
import EditIcon from '@mui/icons-material/Edit';
import ProfileEditForm from '../components/ProfileEditForm';
import Header from '../components/Header';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [backendUserData, setBackendUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: userResponse } = await supabase.auth.getUser();
      if (userResponse?.user) {
        setUser(userResponse.user);
        setUserData(userResponse.user.user_metadata || {});
        
        // Obtener datos del usuario desde el backend
        try {
          const backendResponse = await fetch(`http://localhost:8080/api/usuarios/by-email/${userResponse.user.email}`);
          if (backendResponse.ok) {
            const backendData = await backendResponse.json();
            setBackendUserData(backendData);
          } else {
            console.error('Error fetching user data from backend');
          }
        } catch (err) {
          console.error('Error fetching backend data:', err);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  const handleProfileUpdate = (updatedData) => {
    setBackendUserData(updatedData);

    const updateSupabaseMetadata = async () => {
      const { error } = await supabase.auth.updateUser({
        data: {
          nickname: updatedData.nickname,
          nombre: updatedData.nombre,
          apellido: updatedData.apellido
        }
      });

      if (error) {
        console.error('Error updating Supabase metadata:', error);
      } else {
        setUserData({
          nickname: updatedData.nickname,
          nombre: updatedData.nombre,
          apellido: updatedData.apellido
        });
      }
    };

    updateSupabaseMetadata();
    setActiveTab(0);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  const displayData = {
    ...userData,
    ...backendUserData,
    email: user?.email
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 4, ml: '240px' }}>
          <Container maxWidth="md">
            <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
              <Tab label="Mi Perfil" />
              <Tab label="Editar Perfil" />
            </Tabs>

            {activeTab === 0 ? (
              <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '2.5rem', mb: 2 }}>
                    {displayData?.nombre ? displayData.nombre[0].toUpperCase() : user?.email[0].toUpperCase()}
                  </Avatar>
                  <Typography variant="h5">
                    {displayData?.nombre} {displayData?.apellido}
                  </Typography>
                  {displayData?.nickname && (
                    <Typography variant="subtitle1" color="text.secondary">@{displayData.nickname}</Typography>
                  )}

                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />} 
                    sx={{ mt: 2 }}
                    onClick={() => setActiveTab(1)}
                  >
                    Editar Perfil
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Información de Contacto</Typography>
                <Typography variant="body1"><strong>Email:</strong> {user?.email}</Typography>

                {displayData?.rol && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>Rol</Typography>
                    <Typography variant="body1">{displayData.rol}</Typography>
                  </>
                )}

                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Última actualización del perfil: {
                    backendUserData?.actualizadoEn 
                      ? new Date(backendUserData.actualizadoEn).toLocaleString()
                      : new Date(user?.updated_at).toLocaleString()
                  }
                </Typography>
              </Paper>
            ) : (
              <ProfileEditForm 
                userData={displayData} 
                userEmail={user?.email}
                onProfileUpdate={handleProfileUpdate}
              />
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
