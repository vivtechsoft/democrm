import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const BarChart = ({ 
  data = [],
  labels = [],
  title = 'Bar Chart',
  height = 300,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  horizontal = false
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: title,
            data: data,
            backgroundColor: colors.slice(0, data.length),
            borderColor: colors.slice(0, data.length).map(color => color + 'CC'),
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.7,
          },
        ],
      };

      const config = {
        type: horizontal ? 'bar' : 'bar',
        data: chartData,
        options: {
          indexAxis: horizontal ? 'y' : 'x',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: {
                  size: 12,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `${context.dataset.label}: ${context.parsed[horizontal ? 'x' : 'y']}`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                callback: (value) => {
                  if (value >= 1000) {
                    return `$${(value / 1000).toFixed(1)}k`;
                  }
                  return `$${value}`;
                },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                borderDash: [5, 5],
              },
            },
          },
        },
      };

      chartInstance.current = new Chart(ctx, config);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labels, title, colors, horizontal]);

  return <canvas ref={chartRef} height={height} />;
};

export default BarChart;