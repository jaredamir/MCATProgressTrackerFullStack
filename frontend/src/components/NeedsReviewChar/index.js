"use client"
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const NeedsReviewChart = () => {
    const [chartData, setChartData] = useState(null);  // Initial data state
    const [loading, setLoading] = useState(true);  // Loading state to prevent premature rendering

    useEffect(() => {
        // Fetch data from Flask backend
        fetch('http://127.0.0.1:5000/api/data')
            .then((response) => response.json())
            .then((data) => {
                // Prepare the data for Chart.js
                const sections = Object.keys(data);
                const yesCounts = sections.map((section) => data[section].Yes || 0);
                const noCounts = sections.map((section) => data[section].No || 0);

                setChartData({
                    labels: sections, // Sections (Bio, Chem, Physics, etc.)
                    datasets: [
                        {
                            label: 'Yes',
                            data: yesCounts,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'No',
                            data: noCounts,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                });
                setLoading(false);  // Set loading to false once data is fetched
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;  // Prevent rendering the chart until data is loaded
    }

    return (
        <div>
            <h2>Yes/No Counts per Section</h2>
            <Bar data={chartData} />
        </div>
    );
};

export default NeedsReviewChart;
