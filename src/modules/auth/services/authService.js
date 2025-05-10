// src/modules/auth/services/authService.js
const API_URL = 'http://localhost:8080/v1/auth'; // URL de tu backend

// Función para iniciar sesión con Magic Link (sin contraseña)
export const loginWithMagicLink = async (email) => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/welcome'
      }
    });

    if (error) {
      throw error;
    }

    return { success: true, message: 'Se ha enviado un enlace de acceso a tu correo electrónico.' };
  } catch (error) {
    console.error('Error en envío de magic link:', error);
    throw new Error(error.message || 'Error al enviar enlace de acceso');
  }
};

// Función para registrar un nuevo usuario (con contraseña generada aleatoriamente)
export const register = async (email, userData) => {
  try {
    // Generar una contraseña aleatoria segura
    const randomPassword = generateRandomPassword();
    
    // Registrar usuario en Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password: randomPassword, // Contraseña aleatoria que el usuario no necesita conocer
      options: {
        data: {
          // Metadatos que se guardarán en Supabase
          username: userData.username,
          first_name: userData.firstName,
          last_name: userData.lastName
        }
      }
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      userId: data.user.id,
      message: 'Usuario registrado correctamente. Revisa tu correo para confirmar tu cuenta.'
    };
  } catch (error) {
    console.error('Error en registro:', error);
    throw new Error(error.message || 'Error al registrar usuario');
  }
};

// Función para verificar si el usuario está autenticado
export const checkAuth = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }

    return {
      isAuthenticated: !!session,
      user: session?.user || null
    };
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    return {
      isAuthenticated: false,
      user: null
    };
  }
};

// Función para cerrar sesión
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw new Error('Error al cerrar sesión');
  }
};

// Utilidad para generar contraseña aleatoria
const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};