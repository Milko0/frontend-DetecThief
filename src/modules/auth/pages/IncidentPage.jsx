import React, { useEffect, useState } from 'react';
import axios from 'axios';
// ... otros imports

const IncidentPage = () => {
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/incidents/1') // cambiar el numero  ...
      .then(response => setIncident(response.data))
      .catch(error => console.error('Error al cargar incidente', error));
  }, []);

  const handleConfirm = () => {
    axios.put(`http://localhost:8080/api/incidents/${incident.id}/confirm`)
      .then(() => alert('Incidente confirmado'))
      .catch(err => console.error(err));
  };

  const handleReject = () => {
    axios.put(`http://localhost:8080/api/incidents/${incident.id}/reject`)
      .then(() => alert('Incidente rechazado'))
      .catch(err => console.error(err));
  };

  if (!incident) return <div>Cargando...</div>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 4, ml: { xs: 0, md: '240px' } }}>
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>Incidentes Detectados</Typography>

            <Paper sx={{ p: 3, mb: 4 }}>
              <Grid container spacing={2} justifyContent="center" alignItems="center" textAlign="center">
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={`http://localhost:8080/api/incidents/image/${incident.imagenReferencia}`}
                      alt="Incidente"
                      style={{ width: '25%', minWidth: 150, height: 'auto', borderRadius: 8 }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>¿Es realmente un incidente?</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button variant="outlined" onClick={handleConfirm}>Sí</Button>
                    <Button variant="outlined" onClick={handleReject}>No</Button>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ mt: 2 }} />
            </Paper>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default IncidentPage;



