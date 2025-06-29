// src/modules/auth/components/DashboardCharts.jsx
import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const DashboardCharts = ({ chart }) => {
  const barData = {
    labels: ["Robo", "Vandalismo", "Emergencias", "Otros"],
    datasets: [
      {
        label: "Incidentes por tipo",
        data: [12, 9, 5, 3],
        backgroundColor: ["#1976d2", "#dc004e", "#ff9800", "#9c27b0"],
      },
    ],
  };

  const pieData = {
    labels: ["Resueltos", "Pendientes", "Descartados"],
    datasets: [
      {
        data: [15, 6, 3],
        backgroundColor: ["#4caf50", "#ffc107", "#f44336"],
      },
    ],
  };

  const lineData = {
    labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    datasets: [
      {
        label: "Incidentes diarios",
        data: [2, 4, 3, 5, 1],
        borderColor: "#3f51b5",
        backgroundColor: "rgba(63, 81, 181, 0.2)",
        tension: 0.3,
      },
    ],
  };

  if (chart === "bar") return <Bar data={barData} />;
  if (chart === "pie") return <Pie data={pieData} />;
  if (chart === "line") return <Line data={lineData} />;

  return null;
};

export default DashboardCharts;
