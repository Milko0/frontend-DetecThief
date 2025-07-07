// src/services/incidentService.js

const BASE_URL = 'http://localhost:8082/api/incidents';
const BASE_URL_HISTORIAL = `${BASE_URL}/historial`;

export const obtenerIncidentes = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error('Error al obtener los incidentes');
  return await response.json();
};

export const crearIncidente = async (nuevoIncidente) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoIncidente),
  });
  if (!response.ok) throw new Error('Error al crear incidente');
  return await response.json();
};

export const confirmarIncidente = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/confirm`, { method: 'PUT' });
  if (!response.ok) throw new Error('Error al confirmar incidente');
};

export const rechazarIncidente = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/reject`, { method: 'PUT' });
  if (!response.ok) throw new Error('Error al rechazar incidente');
};

export const obtenerHistorialIncidentes = async () => {
  const response = await fetch(BASE_URL_HISTORIAL);
  if (!response.ok) throw new Error('Error al obtener historial de incidentes');
  return await response.json();
};
