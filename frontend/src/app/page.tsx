"use client"
import BarChart from '../components/BarChart';
import { useState, useEffect } from "react";

export default function Home() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:5000/api/data');
      const data = await response.json();
      setChartData(data);
    };

    fetchData();
  }, []);
  return (
    <div>
      <main>
      <h1>My Chart.js Bar Chart</h1>
      {chartData ? (
        <BarChart data={chartData} />
      ) : (
        <p>Loading...</p>
      )}
      </main>
    </div>
  );
}
