// src/modules/auth/components/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService'; // Asegúrate de que la ruta de importación sea correcta

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState(''); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validación básica
    if (!username || !email || !firstName || !lastName) {
      setError('Todos los campos son obligatorios.');
      setLoading(false);
      return;
    }

    try {
      // Utilizar la función register del authService que ya maneja la lógica completa
      const userData = {
        username,
        firstName,
        lastName
      };
      
      const response = await register(email, userData);
      
      if (response.success) {
        setSuccess(response.message);
        
        // Limpiar el formulario después de un registro exitoso
        setUsername('');
        setEmail(''); 
        setFirstName('');
        setLastName('');
        
        // Opcionalmente, redirigir al login después de unos segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.message || 'Error en el registro');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'No se pudo registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Correo</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>  
        <div>
          <label>Nombre</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div>
          <label>Apellido</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div> 
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;