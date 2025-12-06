"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function DashboardChart() {
  const data = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Vitórias",
        data: [3, 5, 4, 6, 7, 9],
        borderColor: "rgb(249,115,22)",
        backgroundColor: "rgba(249,115,22,0.2)",
        tension: 0.4,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#ccc" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        ticks: { color: "#ccc" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
    plugins: {
      legend: { labels: { color: "white" } },
    },
  };

  return (
    <div className="mt-10 px-4">
      <h2 className="text-xl font-bold mb-3">📈 Evolução</h2>

      <div className="bg-[#1B2537] p-4 rounded-xl h-64 shadow-lg border border-white/10">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
