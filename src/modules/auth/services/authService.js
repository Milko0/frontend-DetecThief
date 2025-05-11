// src/modules/auth/services/authService.js
import { supabase } from '../../../supabaseClient';

// URL de backend si es necesario para verificaciones adicionales
const API_URL = 'http://localhost:8080/v1/auth';

/**
 * Verifica si un correo electrónico existe en la base de datos
 * Utilizamos una tabla personalizada de usuarios para esta verificación
 */
export const checkEmailExists = async (email) => {
  try {
    // Buscar el email en la tabla de usuarios (esto depende de tu estructura de datos)
    // Asume que tienes una tabla 'users' o similar con campo 'email'
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error al verificar email:', error);
      return { exists: false, error: error.message };
    }

    // Si encontramos el email en la tabla, entonces existe
    return { exists: !!data, userData: data || null };
  } catch (error) {
    console.error('Error al verificar correo:', error);
    return { exists: false, error: error.message };
  }
};

/**
 * Método alternativo para verificar la existencia de un email 
 * basado en el intento de iniciar sesión y análisis del error
 */
export const verifyEmailWithSignIn = async (email) => {
  try {
    // Intentar iniciar sesión con una contraseña incorrecta
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: 'INTENTIONALLY_WRONG_PASSWORD_FOR_VERIFICATION',
    });

    // Si no hay error, algo está mal (esto no debería suceder)
    if (!error) {
      console.warn('Inexplicably logged in with wrong password during verification');
      return { exists: true };
    }

    // Analizar el mensaje de error para determinar si el usuario existe
    const errorMessage = error.message.toLowerCase();
    
    // Si el error menciona "invalid login credentials", el email existe pero la contraseña es incorrecta
    // Si menciona "email not confirmed", el email existe pero no está confirmado
    // Si menciona "user not found", el email no existe
    if (errorMessage.includes('invalid login credentials') || 
        errorMessage.includes('email not confirmed')) {
      return { exists: true };
    }
    
    if (errorMessage.includes('user not found') || 
        errorMessage.includes('no user found')) {
      return { exists: false };
    }
    
    // Si el mensaje de error no es concluyente, asumimos que no existe por seguridad
    console.warn('Error inconcluyente al verificar email:', error.message);
    return { exists: false };
  } catch (error) {
    console.error('Error en verificación alternativa de email:', error);
    return { exists: false };
  }
};

/**
 * Función para iniciar sesión con Magic Link 
 * (verificando primero si el usuario existe)
 */
export const loginWithMagicLink = async (email) => {
  try {
    // Verificar si el correo existe usando el método más confiable
    let emailExists = false;
    
    // Primero intentamos con la tabla de usuarios
    const checkResult = await checkEmailExists(email);
    emailExists = checkResult.exists;
    
    // Si no pudimos determinar con la tabla, usamos el método alternativo
    if (!emailExists && !checkResult.error) {
      const verifyResult = await verifyEmailWithSignIn(email);
      emailExists = verifyResult.exists;
    }
    
    // Si después de ambas verificaciones, determinamos que el email no existe
    if (!emailExists) {
      return { 
        success: false, 
        message: 'Este correo electrónico no está registrado. Por favor, regístrate primero.' 
      };
    }
    
    // Si el correo existe, procedemos a enviar el Magic Link
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/welcome'
      }
    });

    if (error) {
      throw error;
    }

    return { 
      success: true, 
      message: 'Se ha enviado un enlace de acceso a tu correo electrónico.' 
    };
  } catch (error) {
    console.error('Error en envío de magic link:', error);
    throw new Error(error.message || 'Error al enviar enlace de acceso');
  }
};

/**
 * Función para registrar un nuevo usuario 
 * (verificando primero si el email ya existe)
 */
export const register = async (email, userData) => {
  try {
    // Verificar si el correo ya existe
    const checkResult = await checkEmailExists(email);
    let emailExists = checkResult.exists;
    
    // Si no pudimos determinar con la tabla, usamos el método alternativo
    if (!emailExists && !checkResult.error) {
      const verifyResult = await verifyEmailWithSignIn(email);
      emailExists = verifyResult.exists;
    }
    
    if (emailExists) {
      return { 
        success: false, 
        message: 'Este correo electrónico ya está registrado. Por favor, inicia sesión.' 
      };
    }
    
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

    // También guardar en la tabla personalizada de usuarios para futuras verificaciones
    try {
      await supabase.from('users').insert([
        { 
          user_id: data.user.id,
          email: email,
          username: userData.username,
          first_name: userData.firstName,
          last_name: userData.lastName
        }
      ]);
    } catch (tableError) {
      console.error('Error al guardar en tabla de usuarios:', tableError);
      // Continuamos incluso si hay error aquí, no es crítico
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

/**
 * Función para verificar si el usuario está autenticado
 */
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

/**
 * Función para cerrar sesión
 */
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

/**
 * Utilidad para generar contraseña aleatoria
 */
const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};