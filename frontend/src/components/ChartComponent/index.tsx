// components/BarChart.js
import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

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

interface ChartComponentProps {
  chartName: string, 
  data: any,
  analytic: string,
  graphType: "Bar"| "Line"
}

const ChartComponent = ({ chartName, data, analytic, graphType }: ChartComponentProps) => {
  const { background, border } = getRandomColor();
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
  switch(graphType.toLowerCase()){
    case "bar":
      return <Bar data={chartData} />;
    case "line":
      return <Line data={chartData} />
  }
  return undefined
  
};

export default ChartComponent;
