// src/modules/auth/pages/WelcomePage.jsx
import React, { useEffect, useState } from 'react';
import { Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from '../../utils/supabaseClient'; // Importar el cliente de Supabase

const WelcomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar la sesión
    const session = supabase.auth.session();

    if (session) {
      console.log('Usuario autenticado:', session.user);  // Mensaje de depuración
      setUser(session.user);
    } else {
      console.log('No hay sesión, redirigiendo al login');  // Mensaje de depuración
      navigate('/login');  // Si no hay sesión, redirigir al login
    }

    // Escuchar cambios en la sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        console.log('Usuario autenticado (listener):', session.user);  // Mensaje de depuración
        setUser(session.user);
      } else {
        console.log('No hay sesión (listener), redirigiendo al login');  // Mensaje de depuración
        navigate('/login');
      }
    });

    return () => {
      listener?.unsubscribe();  // Limpiar el listener
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');  // Redirigir al login después de cerrar sesión
  };

  return (
    <Container maxWidth="xs" sx={{ textAlign: 'center', marginTop: '50px' }}>
      {user ? (
        <>
          <Typography variant="h4" sx={{ marginBottom: '20px' }}>
            ¡Bienvenido, {user.email}!
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            Has iniciado sesión exitosamente con el Magic Link.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </>
      ) : (
        <Typography variant="h5">
          Cargando...
        </Typography>
      )}
    </Container>
  );
};

export default WelcomePage;
