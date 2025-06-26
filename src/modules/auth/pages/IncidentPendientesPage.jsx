// src/modules/auth/pages/IncidentPendientesPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Grid,
  Divider,
  Tooltip,
  Chip
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { obtenerIncidentes, confirmarIncidente, rechazarIncidente } from "../../auth/services/incidentService";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const IncidentPendientesPage = () => {
  const [incidentes, setIncidentes] = useState([]);

  const cargarIncidentes = async () => {
    try {
      const data = await obtenerIncidentes();
      const pendientes = data.filter((i) => i.estado.toLowerCase() === "pendiente");
      setIncidentes(pendientes);
    } catch (error) {
      console.error("Error al cargar los incidentes pendientes", error);
    }
  };

  const manejarConfirmacion = async (id) => {
    try {
      await confirmarIncidente(id);
      cargarIncidentes();
    } catch (error) {
      console.error("Error al confirmar incidente", error);
    }
  };

  const manejarRechazo = async (id) => {
    try {
      await rechazarIncidente(id);
      cargarIncidentes();
    } catch (error) {
      console.error("Error al rechazar incidente", error);
    }
  };

  useEffect(() => {
    cargarIncidentes();
  }, []);

  return (
    <>
      <Header />
      <Sidebar />

      <Box sx={{ marginLeft: "240px", padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Incidentes Pendientes
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {incidentes.length === 0 ? (
          <Typography>No hay incidentes pendientes.</Typography>
        ) : (
          <Grid container spacing={3}>
            {incidentes.map((incidente) => (
              <Grid item xs={12} md={6} key={incidente.id}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    backgroundColor: "#fafafa",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="subtitle2" color="primary">
                      #{incidente.id} | Cámara {incidente.cameraId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tipo de incidente ID: {incidente.tipoIncidentId}
                    </Typography>
                    <Typography>{incidente.descripcion}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Detectado: {new Date(incidente.fechaDetectado).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Estado del sistema: <strong>{incidente.estadoSistema}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Creado en: {new Date(incidente.creadoEn).toLocaleString()}
                    </Typography>

                    {/* Imagen de referencia */}
                    {incidente.imagenReferencia && (
                      <Box
                        component="img"
                        src={incidente.imagenReferencia}
                        alt="Referencia"
                        sx={{
                          mt: 1,
                          borderRadius: 1,
                          maxHeight: 200,
                          objectFit: "cover",
                          width: "100%",
                        }}
                      />
                    )}

                    {/* Acciones */}
                    <Box sx={{ display: "flex", justifyContent: "end", mt: 1 }}>
                      <Tooltip title="Confirmar">
                        <IconButton color="success" onClick={() => manejarConfirmacion(incidente.id)}>
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rechazar">
                        <IconButton color="error" onClick={() => manejarRechazo(incidente.id)}>
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default IncidentPendientesPage;
