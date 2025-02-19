"use client"
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReasonForMissingFrequencyChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <p>No data available</p>;
  }

  // Extract sections and reasons
  const sections = Object.keys(data);
  const reasons = new Set();

  sections.forEach((section) => {
    Object.keys(data[section]).forEach((reason) => reasons.add(reason));
  });

  const reasonList = Array.from(reasons);

  // Format data for Chart.js
  const chartData = {
    labels: sections,
    datasets: reasonList.map((reason, i) => ({
      label: reason,
      data: sections.map((section) => data[section][reason] || 0),
      backgroundColor: `rgba(${50 + i * 30}, ${100 + i * 20}, 200, 0.7)`,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Practice Test Review Analysis" },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default ReasonForMissingFrequencyChart;
