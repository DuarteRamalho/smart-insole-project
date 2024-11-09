import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Navbar from './components/Navbar';
import PressureVisualization from './components/PressureVisualization';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/data')
      .then(res => res.json())
      .then(data => setData(data));

    fetch('http://localhost:5001/api/summary')
      .then(res => res.json())
      .then(summary => setSummary(summary));
  }, []);

  // Prepare data for daily steps chart
  const dailyStepsChart = data?.daily_steps ? {
    labels: data.daily_steps.map(day => day.date),
    datasets: [{
      label: 'Daily Steps',
      data: data.daily_steps.map(day => day.total_steps),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  } : null;

  // Prepare heart rate data for current day with 2-hour intervals
  const heartRateChart = data?.hourly_data ? {
    labels: data.hourly_data
      .filter(hour => {
        // Get current date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Convert timestamp to Date
        const dataDate = new Date(hour.timestamp);
        return dataDate >= today;
      })
      // Filter for every 2 hours (0, 2, 4, etc.)
      .filter((_, index) => index % 2 === 0)
      // Format time as HH:MM
      .map(hour => {
        const date = new Date(hour.timestamp);
        return date.toLocaleTimeString('pl-PL', {
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false,
          timeZone:'Europe/Warsaw'
        });
      }),
    datasets: [{
      label: 'Heart Rate Today',
      data: data.hourly_data
        .filter(hour => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dataDate = new Date(hour.timestamp);
          return dataDate >= today;
        })
        .filter((_, index) => index % 2 === 0)
        .map(hour => hour.heart_rate),
      fill: false,
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1
    }]
  } : null;

  return (
    <div className="min-h-screen bg-gray-100 w-screen overflow-x-hidden">
      <Navbar />
      <div className="px-8 pt-20">
        {/* Summary Section */}
        {summary && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            
            <div className="bg-blue-100 p-4 rounded">
              <h2 className="font-bold">Total Steps</h2>
              <p>{summary.total_steps}</p>
            </div>
            <div className="bg-green-100 p-4 rounded">
              <h2 className="font-bold">Average Heart Rate</h2>
              <p>{summary.average_heart_rate} BPM</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded">
              <h2 className="font-bold">Total Calories</h2>
              <p>{summary.total_calories}</p>
            </div>
          </div>
        )}

          {/* Pressure Visualization */}
          {summary && (
          <div className="mb-6">
            <PressureVisualization data={summary} />
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dailyStepsChart && (
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Daily Steps</h2>
              <Bar 
                data={dailyStepsChart}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Daily Steps' }
                  }
                }}
              />
            </div>
          )}

          {heartRateChart && (
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Today's Heart Rate (2-Hour Intervals)</h2>
              <Line 
                data={heartRateChart}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Heart Rate Variation' }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      min: 50,  // Typical minimum heart rate
                      max: 120  // Typical maximum heart rate
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
