"use client"
import BarChart from '../components/BarChart';
import { useState, useEffect } from "react";
import ReasonForMissingFrequencyChart from '../components/ReasonForMissingFrequencyChart'
import axios from 'axios';

export default function Home() {
  const [chartData, setChartData] = useState<any>(null);
  const [chartView, setChartView] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function getReasonForMissingFrequencyData(){
    console.log("called")
    setIsLoading(false);
    try {
      const res = await axios.get("http://localhost:5000/api/reason-for-missing-frequencies", {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true // This ensures cookies are included in the request
      });
  
      // If successful, set the data
      setChartData(res.data);
      setChartView(<ReasonForMissingFrequencyChart data={res.data}/>);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div>
      <main>
      <h1>MCAT Analytics</h1>
      <div style={{
        display: 'flex',
        gap: '15px',

      }}>
        <p>Needs review</p>
        <p onClick={() => getReasonForMissingFrequencyData()}>Reason for missing</p>
      </div>
        {isLoading ? "loading..." : undefined}
        {chartView}
      </main>
    </div>
  );
}
