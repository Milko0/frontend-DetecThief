// src/modules/auth/components/RegisterForm.jsx
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!username || !email || !firstName || !lastName) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      // 1. Registrar en Supabase Auth sin password (magic link)
      const {  error: supabaseError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'http://localhost:3000/confirm',
        },
      });

      if (supabaseError) throw supabaseError;

      // 2. Enviar los datos al backend
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          firstName,
          lastName,
          role,
        }),
      });

      if (!response.ok) throw new Error('Error al guardar en el backend');

      setSuccess('Se envió el enlace de confirmación al correo');
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudo registrar el usuario');
      setSuccess('');
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
        <div>
          <label>Rol</label>
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterForm;
