// src/modules/auth/components/RegisterForm.jsx
import React, { useState } from 'react';
import { supabase } from '../../../supabaseClient';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState(''); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para generar una contraseña aleatoria segura
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

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
      // Generar contraseña aleatoria para Supabase
      const randomPassword = generateRandomPassword();

      // Registrar usuario en Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: randomPassword, // Se registra con contraseña aleatoria que no necesitará recordar
      });

      if (authError) throw new Error(authError.message); 

      setSuccess('Usuario registrado correctamente. Se ha enviado un correo para verificar tu cuenta.');
      
      // Limpiar el formulario después de un registro exitoso
      setUsername('');
      setEmail(''); 
      setFirstName('');
      setLastName(''); 
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