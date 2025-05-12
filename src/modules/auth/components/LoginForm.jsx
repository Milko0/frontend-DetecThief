// src/modules/auth/components/LoginForm.jsx
import React, { useState } from 'react';
import { login } from '../services/authService'; // Importamos el servicio de login
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validación básica
    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      setLoading(false);
      return;
    }

    // Validación simple del formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      setLoading(false);
      return;
    }

    try {
      const response = await login(email);
      setSuccess(response.message);
      // Limpiar el campo después de un login exitoso
      setEmail('');
    } catch (error) {
      setError(error.message || 'Error en la autenticación');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div> 
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;