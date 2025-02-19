"use client"

import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ReasonForMissingFrequencies() {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);  // To track if the data is still loading

    useEffect(() => {
        // Fetch data from Flask backend
        fetch('http://127.0.0.1:5000/api/reason-for-missing-frequencies')
            .then((response) => response.json())
            .then((data) => {
                console.log("Received data:", data);  // Log the received data

                // Transform the fetched data into a format that Chart.js can use
                const transformedData = transformDataForChart(data);
                console.log("Transformed data for chart:", transformedData);  // Log the transformed data

                // Set the chart data into state
                setChartData(transformedData);
                setLoading(false);  
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    // Transform API response into Chart.js-compatible format
    function transformDataForChart(data) {
        const labels = [];
        const datasets = [];
        const reasonCounts = {};  // To accumulate the counts per test

        // Iterate through each test
        const testKeys = Object.keys(data);
        testKeys.forEach((testKey) => {
            const sections = data[testKey];

            // Iterate through each section of a test
            Object.keys(sections).forEach((section) => {
                const reasonList = sections[section];

                // Generate a unique label for the test-section combination
                const sectionLabel = `${testKey} - ${section}`;
                labels.push(sectionLabel);  // Store section labels for x-axis
                
                // Iterate through the reason counts and accumulate
                Object.keys(reasonList).forEach((reason) => {
                    if (!reasonCounts[reason]) {
                        reasonCounts[reason] = Array(labels.length).fill(0);  // Initialize array to store counts
                    }

                    // Find the index of the current test-section label
                    const index = labels.indexOf(sectionLabel);
                    reasonCounts[reason][index] = reasonList[reason];  // Update count for the reason at the correct index
                });
            });
        });

        // Prepare datasets for Chart.js
        Object.keys(reasonCounts).forEach((reason) => {
            datasets.push({
                label: reason,
                data: reasonCounts[reason],  // Data for each reason across the test-sections
                backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Set color for bars
                borderColor: 'rgba(75, 192, 192, 1)',  // Border color
                borderWidth: 1,
            });
        });

        return {
            labels,  // Section labels for the x-axis
            datasets,  // Datasets with frequencies of reasons
        };
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Reason for Missing Frequencies</h2>
            {/* Display chart when data is ready */}
            {chartData ? (
                <Bar data={chartData} options={{ responsive: true }} />
            ) : (
                <div>No data available</div>
            )}
        </div>
    );
}
