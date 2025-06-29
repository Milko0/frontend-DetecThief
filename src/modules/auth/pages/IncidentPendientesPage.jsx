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
  Container,
  Snackbar,
  Alert,
  TextField,
  Drawer,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
  obtenerIncidentes,
  confirmarIncidente,
  rechazarIncidente,
} from "../../auth/services/incidentService";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const IncidentPendientesPage = () => {
  const [incidentes, setIncidentes] = useState([]);
  const [filtros, setFiltros] = useState({
    cameraId: "",
    tipoIncidentId: "",
    estadoSistema: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [selectedIncidente, setSelectedIncidente] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      setSnackbar({ open: true, message: "Incidente confirmado", severity: "success" });
      cargarIncidentes();
    } catch (error) {
      setSnackbar({ open: true, message: "Error al confirmar", severity: "error" });
    }
  };

  const manejarRechazo = async (id) => {
    try {
      await rechazarIncidente(id);
      setSnackbar({ open: true, message: "Incidente rechazado", severity: "warning" });
      cargarIncidentes();
    } catch (error) {
      setSnackbar({ open: true, message: "Error al rechazar", severity: "error" });
    }
  };

  const filtrarIncidentes = () => {
    return incidentes.filter((i) =>
      (!filtros.cameraId || i.cameraId.toString().includes(filtros.cameraId)) &&
      (!filtros.tipoIncidentId || i.tipoIncidentId.toString().includes(filtros.tipoIncidentId)) &&
      (!filtros.estadoSistema || i.estadoSistema.toLowerCase().includes(filtros.estadoSistema.toLowerCase()))
    );
  };

  const abrirDrawer = (incidente) => {
    setSelectedIncidente(incidente);
    setDrawerOpen(true);
  };

  useEffect(() => {
    cargarIncidentes();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 4, ml: { xs: 0, md: "240px" } }}>
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>Incidentes Pendientes</Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Filtros */}
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
              <TextField
                label="Cámara ID"
                value={filtros.cameraId}
                onChange={(e) => setFiltros({ ...filtros, cameraId: e.target.value })}
              />
              <TextField
                label="Tipo Incidente ID"
                value={filtros.tipoIncidentId}
                onChange={(e) => setFiltros({ ...filtros, tipoIncidentId: e.target.value })}
              />
              <TextField
                label="Estado Sistema"
                value={filtros.estadoSistema}
                onChange={(e) => setFiltros({ ...filtros, estadoSistema: e.target.value })}
              />
            </Box>

            {filtrarIncidentes().length === 0 ? (
              <Typography>No hay incidentes pendientes.</Typography>
            ) : (
              <Grid container spacing={3}>
                {filtrarIncidentes().map((incidente) => (
                  <Grid item xs={12} sm={10} md={6} lg={5} key={incidente.id}>
                    <Paper elevation={3} sx={{ p: 2, backgroundColor: "#fafafa", "&:hover": { backgroundColor: "#f0f0f0" } }}>
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

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                          <Tooltip title="Ver detalles">
                            <IconButton onClick={() => abrirDrawer(incidente)}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Box>
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
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Drawer para detalles */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 320, p: 2 }}>
          <Typography variant="h6" gutterBottom>Detalles del Incidente</Typography>
          {selectedIncidente && (
            <>
              <Typography>ID: {selectedIncidente.id}</Typography>
              <Typography>Cámara: {selectedIncidente.cameraId}</Typography>
              <Typography>Tipo: {selectedIncidente.tipoIncidentId}</Typography>
              <Typography>Descripción: {selectedIncidente.descripcion}</Typography>
              <Typography>Fecha: {new Date(selectedIncidente.fechaDetectado).toLocaleString()}</Typography>
              <Typography>Estado: {selectedIncidente.estado}</Typography>
              <Typography>Sistema: {selectedIncidente.estadoSistema}</Typography>
              {selectedIncidente.imagenReferencia && (
                <Box
                  component="img"
                  src={selectedIncidente.imagenReferencia}
                  alt="Imagen"
                  sx={{ width: "100%", mt: 2, borderRadius: 1 }}
                />
              )}
              <Button onClick={() => setDrawerOpen(false)} sx={{ mt: 2 }} fullWidth variant="contained">Cerrar</Button>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default IncidentPendientesPage;
