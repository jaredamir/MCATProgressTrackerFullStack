// components/BarChart.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const colorPalette = [
  { background: 'rgba(75, 192, 192, 0.2)', border: 'rgba(75, 192, 192, 1)' },
  { background: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
  { background: 'rgba(255, 205, 86, 0.2)', border: 'rgba(255, 205, 86, 1)' },
  { background: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
  { background: 'rgba(153, 102, 255, 0.2)', border: 'rgba(153, 102, 255, 1)' },
  { background: 'rgba(255, 159, 64, 0.2)', border: 'rgba(255, 159, 64, 1)' },
  { background: 'rgba(201, 203, 207, 0.2)', border: 'rgba(201, 203, 207, 1)' },
  { background: 'rgba(0, 123, 255, 0.2)', border: 'rgba(0, 123, 255, 1)' },
];


function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colorPalette.length);
  return colorPalette[randomIndex];
}

const BarChart = ({ chartName, data, analytic }) => {
  const labels = Object.keys(data)
  const { background, border } = getRandomColor();const color = getRandomColor()
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: chartName,
        data: Object.values(data),
        backgroundColor:background,  //'rgba(75, 192, 192, 0.2)',
        borderColor: border,//'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
  
};

export default BarChart;
