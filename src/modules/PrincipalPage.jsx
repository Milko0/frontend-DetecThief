// src/modules/pages/PrincipalPage.jsx
import React from "react";
import { Box, Container, Typography, Paper, Divider, Grid } from "@mui/material";
import Sidebar from "./auth/components/Sidebar";
import Header from "./auth/components/Header";
import DashboardCharts from "./auth/components/DashboardCharts";

const PrincipalPage = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 4,
            ml: { xs: 0, md: "240px" },
            backgroundColor: "#f4f6f8",
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
              Pantalla Principal
            </Typography>

            <Paper elevation={4} sx={{ p: 4, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                📊 Dashboard de Estadísticas
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Incidentes por Tipo
                  </Typography>
                  <DashboardCharts />
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default PrincipalPage;

