// src/modules/auth/services/authService.js
const API_URL = 'http://localhost:8080/v1/auth';  // URL de tu backend (ajusta si es necesario)

// Función para hacer login
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }), // Enviamos email y contraseña al backend
  });

  if (!response.ok) {
    throw new Error('Error en la autenticación'); // Si la respuesta no es ok, lanzamos un error
  }

  return response.json();  // Retornamos la respuesta del backend
};
