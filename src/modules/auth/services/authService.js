// src/modules/auth/services/authService.js
const API_URL = 'http://localhost:8080/v1/auth'; // Cambia esta URL si es necesario

// Función para hacer login
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Error en la autenticación');
  }

  return response.json();
};

// Función para hacer registro
export const register = async (name, email, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    throw new Error('Error en el registro');
  }

  return response.json();
};
