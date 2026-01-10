import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { formatDate } from '../../../utils/formatters';

Chart.register(...registerables);

const LineChart = ({ 
  data = [],
  title = 'Performance Chart',
  height = 300,
  xAxisKey = 'date',
  yAxisKey = 'value',
  color = '#3b82f6'
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
        labels: data.map(item => formatDate(item[xAxisKey], 'MMM dd')),
        datasets: [
          {
            label: title,
            data: data.map(item => item[yAxisKey]),
            borderColor: color,
            backgroundColor: `${color}20`,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: color,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };

      const config = {
        type: 'line',
        data: chartData,
        options: {
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
              mode: 'index',
              intersect: false,
              callbacks: {
                label: (context) => {
                  return `${context.dataset.label}: ${context.parsed.y}`;
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
                maxRotation: 0,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                borderDash: [5, 5],
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
          },
          interaction: {
            intersect: false,
            mode: 'nearest',
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
  }, [data, title, xAxisKey, yAxisKey, color]);

  return <canvas ref={chartRef} height={height} />;
};

export default LineChart;