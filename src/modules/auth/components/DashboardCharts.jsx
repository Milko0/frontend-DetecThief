// src/modules/auth/components/DashboardCharts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const DashboardCharts = () => {
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [],
  });

  const [doughnutData, setDoughnutData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    axios
      .get("https://incident-service-rlrr.onrender.com/api/incidents/historial/with-type")
      .then((response) => {
        const data = response.data;

        // Agrupar por tipo de incidente
        const tipoCounts = {};
        const estadoCounts = {};

        data.forEach((item) => {
          // Conteo por tipo de incidente
          const tipo = item.tipoIncidenteNombre || "Desconocido";
          tipoCounts[tipo] = (tipoCounts[tipo] || 0) + 1;

          // Conteo por estado del sistema
          const estado = item.estadoSistema || "desconocido";
          estadoCounts[estado] = (estadoCounts[estado] || 0) + 1;
        });

        // Datos para gráfico de barras
        const tipoLabels = Object.keys(tipoCounts);
        const tipoValues = Object.values(tipoCounts);
        setBarData({
          labels: tipoLabels,
          datasets: [
            {
              label: "Incidentes por tipo",
              data: tipoValues,
              backgroundColor: [
                "#1976d2",
                "#dc004e",
                "#ff9800",
                "#9c27b0",
                "#00acc1",
                "#66bb6a",
                "#e91e63",
                "#3f51b5",
              ],
            },
          ],
        });

        // Datos para gráfico de dona
        const estadoLabels = Object.keys(estadoCounts);
        const estadoValues = Object.values(estadoCounts);
        setDoughnutData({
          labels: estadoLabels,
          datasets: [
            {
              label: "Estados de incidentes",
              data: estadoValues,
              backgroundColor: [
                "#4caf50", // resuelto
                "#ffc107", // pendiente
                "#f44336", // descartado
                "#9e9e9e", // desconocido u otro
              ],
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error al obtener los datos de incidentes:", error);
      });
  }, []);

  return (
    <div>
      <h3>📊 Incidentes por Tipo</h3>
      <Bar data={barData} />

      <h3 style={{ marginTop: "40px" }}>🧾 Estados de los Incidentes</h3>
      <Doughnut data={doughnutData} />
    </div>
  );
};

export default DashboardCharts;
