// src/modules/auth/services/authService.js
import { supabase } from '../../../supabaseClient';
 
/**
 * Verifica si un correo electrónico existe en la base de datos
 * Utilizamos una tabla personalizada de usuarios para esta verificación
 */
export const checkEmailExists = async (email) => {
  try {
    console.log("Verificando email en tabla usuarios:", email);
    // Buscar el email en la tabla de usuarios - el nombre correcto es 'usuarios' no 'users'
    const { data, error } = await supabase
      .from('usuarios')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error al verificar email en DB:', error);
      // Como tenemos problemas con la tabla, vamos a usar un método alternativo
      console.log("Intentando verificar directamente con auth...");
      return await verifyEmailWithAuth(email);
    }

    console.log("Resultado de verificación en DB:", data ? "encontrado" : "no encontrado");
    // Si encontramos el email en la tabla, entonces existe
    return { exists: !!data, userData: data || null };
  } catch (error) {
    console.error('Error inesperado al verificar correo en DB:', error);
    // Intentamos el método alternativo
    return await verifyEmailWithAuth(email);
  }
};

/**
 * MÉTODO ALTERNATIVO para verificar si un email existe directamente con la API de autenticación
 * En vez de usar la tabla 'usuarios', consultamos directamente al servicio de autenticación
 */
export const verifyEmailWithAuth = async (email) => {
  try {
    console.log("Verificando email directamente con Auth API:", email);
    
    // Validamos formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Formato de email inválido");
      return { exists: false };
    }
    
    // Realizamos un intento controlado de inicio de sesión para verificar
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false // Esto es crucial: evita crear nuevos usuarios
      }
    });

    // Si no hay error o el error no es "user not found", entonces el usuario existe
    if (!error) {
      console.log("Email verificado: existe (OTP enviado con éxito)");
      return { exists: true };
    }
    
    // Analizamos el mensaje de error
    const errorMessage = error.message.toLowerCase();
    console.log("Respuesta de Auth API:", errorMessage);
    
    // Si el error es "user not found", el email no existe
    if (errorMessage.includes('user not found')) {
      console.log("Email verificado: no existe");
      return { exists: false };
    }
    
    // Cualquier otro error (incluyendo rate limiting, etc.) asumimos que el usuario existe
    // para mayor seguridad en el flujo de login
    console.log("Asumiendo que el email existe basado en la respuesta de Auth");
    return { exists: true };
  } catch (error) {
    console.error('Error inesperado en verificación con Auth API:', error);
    // Por seguridad asumimos que existe en caso de error
    return { exists: true };
  }
};

/**
 * Método antiguo para verificación - mantenido por compatibilidad
 * Ahora simplemente redirige al nuevo método
 */
export const verifyEmailWithSignIn = async (email) => {
  console.log("Método obsoleto, usando verifyEmailWithAuth");
  return await verifyEmailWithAuth(email);
};

/**
 * Función para iniciar sesión con Magic Link 
 * (verificando primero si el usuario existe)
 */
export const loginWithMagicLink = async (email) => {
  try {
    if (!email) {
      return { 
        success: false, 
        message: 'El correo electrónico es obligatorio' 
      };
    }

    console.log("Iniciando proceso de login con Magic Link para:", email);
    
    // Verificar si el correo existe
    const checkResult = await checkEmailExists(email);
    
    // Si después de la verificación, determinamos que el email no existe
    if (!checkResult.exists) {
      console.log("Email no registrado:", email);
      return { 
        success: false, 
        message: 'Este correo electrónico no está registrado. Por favor, regístrate primero.' 
      };
    }
    
    console.log("Email verificado, enviando magic link a:", email);
    
    // Si el correo existe, procedemos a enviar el Magic Link
    // IMPORTANTE: shouldCreateUser: false para evitar la creación automática de usuarios
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/welcome',
        shouldCreateUser: false // Esto evita que se creen usuarios automáticamente
      }
    });

    if (error) {
      // Si el error es que el usuario no existe, mostramos mensaje claro
      if (error.message.toLowerCase().includes('user not found')) {
        console.log("Error confirmado: email no registrado");
        return { 
          success: false, 
          message: 'Este correo electrónico no está registrado en el sistema. Por favor, regístrate primero.' 
        };
      }
      
      console.error("Error al enviar magic link:", error);
      throw error;
    }

    console.log("Magic link enviado correctamente");
    
    return { 
      success: true, 
      message: 'Se ha enviado un enlace de acceso a tu correo electrónico.' 
    };
  } catch (error) {
    console.error('Error en proceso de envío de magic link:', error);
    throw new Error(error.message || 'Error al enviar enlace de acceso');
  }
};

/**
 * Función para registrar un nuevo usuario 
 * (verificando primero si el email ya existe)
 */
export const register = async (email, userData) => {
  try {
    if (!email || !userData || !userData.username || !userData.firstName || !userData.lastName) {
      return {
        success: false,
        message: 'Todos los campos son obligatorios'
      };
    }

    console.log("Iniciando registro para:", email);
    
    // Verificar si el correo ya existe
    const checkResult = await checkEmailExists(email);
    
    if (checkResult.exists) {
      console.log("Email ya registrado:", email);
      return { 
        success: false, 
        message: 'Este correo electrónico ya está registrado. Por favor, inicia sesión.' 
      };
    }
    
    // Generar una contraseña aleatoria segura
    const randomPassword = generateRandomPassword();
    
    console.log("Registrando usuario en Supabase Auth");
    
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
      // Si el error menciona que el usuario ya está registrado, manejamos esto específicamente
      if (error.message.includes('already registered')) {
        console.log("Usuario ya registrado en Auth pero no en tabla personalizada");
        return { 
          success: false, 
          message: 'Este correo electrónico ya está registrado. Por favor, inicia sesión o restablece tu contraseña.' 
        };
      }
      
      console.error("Error al registrar en Supabase Auth:", error);
      throw error;
    }

    console.log("Usuario registrado en Auth. Guardando en tabla usuarios");
    
    // También guardar en la tabla personalizada de usuarios para futuras verificaciones
    try {
      await supabase.from('usuarios').insert([
        { 
          user_id: data.user.id,
          email: email,
          username: userData.username,
          first_name: userData.firstName,
          last_name: userData.lastName
        }
      ]);
      console.log("Usuario guardado exitosamente en tabla usuarios");
    } catch (tableError) {
      console.error('Error al guardar en tabla usuarios:', tableError);
      // Continuamos incluso si hay error aquí, no es crítico
    }

    return {
      success: true,
      userId: data.user.id,
      message: 'Usuario registrado correctamente. Revisa tu correo para confirmar tu cuenta.'
    };
  } catch (error) {
    console.error('Error en proceso de registro:', error);
    
    // Si el error menciona que el usuario ya está registrado, manejamos esto específicamente
    if (error.message && error.message.includes('already registered')) {
      return { 
        success: false, 
        message: 'Este correo electrónico ya está registrado. Por favor, inicia sesión.' 
      };
    }
    
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
      console.error("Error al verificar sesión:", error);
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
      console.error("Error al cerrar sesión:", error);
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