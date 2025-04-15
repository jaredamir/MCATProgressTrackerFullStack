import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useState } from 'react';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement, // Needed for Pie charts
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement // Register Pie chart component
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
  { background: 'rgba(255, 193, 7, 0.2)', border: 'rgba(255, 193, 7, 1)' },
  { background: 'rgba(0, 255, 255, 0.2)', border: 'rgba(0, 255, 255, 1)' },
  { background: 'rgba(255, 87, 34, 0.2)', border: 'rgba(255, 87, 34, 1)' },
  { background: 'rgba(244, 67, 54, 0.2)', border: 'rgba(244, 67, 54, 1)' },
  { background: 'rgba(233, 30, 99, 0.2)', border: 'rgba(233, 30, 99, 1)' },
  { background: 'rgba(139, 195, 74, 0.2)', border: 'rgba(139, 195, 74, 1)' },
  { background: 'rgba(76, 175, 80, 0.2)', border: 'rgba(76, 175, 80, 1)' },
];



let shuffledColors = [...colorPalette]; 

function getRandomColor() {
  if (shuffledColors.length === 0) {
    shuffledColors = [...colorPalette]; // Reset the color pool when it runs out
  }

  const randomIndex = Math.floor(Math.random() * shuffledColors.length);
  const selectedColor = shuffledColors[randomIndex];
  shuffledColors.splice(randomIndex, 1); // Remove the selected color from the array to avoid duplicates
  return selectedColor;
}

const graphTypes = ["bar", "line", "pie"];

const ChartComponent = ({data}) => {
  const [graphType, setGraphType] = useState(data.graphType.toLowerCase() || 'bar');
  const labels = Object.keys(data.data[Object.keys(data.data)[0]])
  const datasets = Object.keys(data.data).map((test) => {
    const { background, border } = getRandomColor();
    return (
      {
        label: test,
        data: Object.values(data.data[test]),
        backgroundColor:background,  //'rgba(75, 192, 192, 0.2)',
        borderColor: border,//'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    )
  })
  const chartData = {
    labels: labels,
    datasets: datasets,
  };
  const options = {
    scales: {
      responsive: true,
      maintainAspectRatio: false,
      y: {
        beginAtZero: true, // This makes sure the scale starts at 0
        ticks: {
          // Customizing tick labels for readability
          callback: function(value) {
            return value.toLocaleString(); // Adds commas to numbers for better readability
          },
          stepSize: 5, // Adjust the step size of the ticks
          max: Math.max(...Object.values(data)) + 10, // Dynamically sets the maximum value for the scale
        },
      },
    },
  };

  return (
    <div>
      <select value={graphType} onChange={(e) => setGraphType(e.target.value)}>
        {graphTypes.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      {graphType === "bar" && <Bar data={chartData} options={options} />}
      {graphType === "line" && <Line data={chartData} options={options} />}
      {graphType === "pie" && (
        <div style={{ maxWidth: "800px", maxHeight: "800px" }}>
          <Pie data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default ChartComponent;
