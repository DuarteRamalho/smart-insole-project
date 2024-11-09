import React from 'react';
import { Line } from 'react-chartjs-2';

function PressureVisualization({ data }) {
  // Prepare data for visualization
  const pressureChart = {
    labels: ['Inner Left', 'Outer Left', 'Inner Right', 'Outer Right'],
    datasets: [{
      label: 'Foot Pressure Distribution (%)',
      data: [
        data?.foot_pressure_summary?.left_foot?.inner_pressure || 0,
        data?.foot_pressure_summary?.left_foot?.outer_pressure || 0,
        data?.foot_pressure_summary?.right_foot?.inner_pressure || 0,
        data?.foot_pressure_summary?.right_foot?.outer_pressure || 0,
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Foot Pressure Distribution</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Left Foot</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-600">Inner Pressure</p>
              <p className="font-bold text-lg">{data?.foot_pressure_summary?.left_foot?.inner_pressure}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Outer Pressure</p>
              <p className="font-bold text-lg">{data?.foot_pressure_summary?.left_foot?.outer_pressure}%</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Balance</p>
              <p className="font-bold text-lg">{data?.foot_pressure_summary?.left_foot?.distribution}% Inner</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Right Foot</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-600">Inner Pressure</p>
              <p className="font-bold text-lg">{data?.foot_pressure_summary?.right_foot?.inner_pressure}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Outer Pressure</p>
              <p className="font-bold text-lg">{data?.foot_pressure_summary?.right_foot?.outer_pressure}%</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Balance</p>
              <p className="font-bold text-lg">{data?.foot_pressure_summary?.right_foot?.distribution}% Inner</p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-64">
        <Line 
          data={pressureChart}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Pressure Distribution Comparison'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'Pressure (%)'
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}

export default PressureVisualization;

