// src/modules/auth/pages/IncidentHistorialPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";
import { obtenerIncidentes } from "../../auth/services/incidentService";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const estadosDisponibles = ["resuelto", "descartado", "validado"];

const IncidentHistorialPage = () => {
  const [historial, setHistorial] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroTexto, setFiltroTexto] = useState("");

  const cargarHistorial = async () => {
    try {
      const data = await obtenerIncidentes();
      const filtrados = data.filter((i) =>
        estadosDisponibles.includes(i.estado.toLowerCase())
      );
      setHistorial(filtrados);
    } catch (error) {
      console.error("Error al cargar el historial", error);
    }
  };

  const aplicarFiltros = () => {
    return historial.filter((i) => {
      const coincideEstado = filtroEstado ? i.estado.toLowerCase() === filtroEstado : true;
      const coincideTexto = filtroTexto
        ? i.descripcion.toLowerCase().includes(filtroTexto.toLowerCase())
        : true;
      return coincideEstado && coincideTexto;
    });
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 4, ml: { xs: 0, md: "240px" } }}>
          <Typography variant="h4" gutterBottom>Historial de Incidentes</Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Buscar por descripción"
                variant="outlined"
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Filtrar por estado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {estadosDisponibles.map((estado) => (
                  <MenuItem key={estado} value={estado}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {aplicarFiltros().length === 0 ? (
            <Typography>No hay incidentes con esos filtros.</Typography>
          ) : (
            <Grid container spacing={3}>
              {aplicarFiltros().map((i) => (
                <Grid item xs={12} md={6} key={i.id}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      backgroundColor: "#fdfdfd",
                      "&:hover": { backgroundColor: "#f2f2f2" },
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Typography variant="subtitle2" color="primary">
                        #{i.id} | Cámara {i.cameraId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tipo de incidente ID: {i.tipoIncidentId}
                      </Typography>
                      <Typography>{i.descripcion}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Detectado: {new Date(i.fechaDetectado).toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Estado del sistema: <strong>{i.estadoSistema}</strong>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Estado: <strong>{i.estado}</strong>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Creado en: {new Date(i.creadoEn).toLocaleString()}
                      </Typography>

                      {i.imagenReferencia && (
                        <Box
                          component="img"
                          src={i.imagenReferencia}
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
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default IncidentHistorialPage;
