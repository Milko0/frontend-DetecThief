// src/modules/auth/services/authService.js
import { supabase } from '../../../supabaseClient';
 
/**
 * Handles user registration in both backend and Supabase auth
 * @param {string} email - User's email address
 * @param {object} userData - Contains username, firstName, lastName
 * @returns {Promise} - Result of the registration process
 */
export const register = async (email, userData) => {
  try {
    // Step 1: Register user in your backend database
    const backendResponse = await fetch('http://localhost:8080/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname: userData.username,
        email: email,
        nombre: userData.firstName,
        apellido: userData.lastName
      })
    }); 
    
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.message || 'Error registering in backend');
    }
    
    // Generar contraseña aleatoria para registro en Supabase
    const randomPassword = generateRandomPassword();
    
    // Step 2: Sign up user in Supabase auth system sin iniciar sesión automáticamente
   const { error } = await supabase.auth.admin.createUser({
  email: email,
  password: randomPassword,
  user_metadata: {
    nickname: userData.username,
    nombre: userData.firstName,
    apellido: userData.lastName
  },
  email_confirm: true
});

    if (error) {
      throw new Error(`Supabase Auth Error: ${error.message}`);
    }

    return {
      success: true,
      message: 'Usuario registrado exitosamente. Revisa tu correo para confirmar.'
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: error.message || 'Error en el registro'
    };
  }
};

/**
 * Handles user login through Supabase Magic Link
 * @param {string} email - User's email address
 * @returns {Promise} - Result of login attempt
 */
export const login = async (email) => {
  try {
    // Check if the email exists in backend
    const checkEmailResponse = await fetch(`http://localhost:8080/api/usuarios/check-email?email=${encodeURIComponent(email)}`, {
      method: 'GET'
    });

    if (!checkEmailResponse.ok) {
      throw new Error('Este correo no está registrado');
    }

    // Sign in with Magic Link through Supabase
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: 'http://localhost:5173/principal',
        shouldCreateUser: false
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: 'Revisa tu correo para el enlace de inicio de sesión'
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Gets currently logged in user
 * @returns {Promise} - User session data
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    return data.session?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Logs out current user
 * @returns {Promise} - Result of logout operation
 */
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error during logout:', error);
    return { success: false, error: error.message };
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