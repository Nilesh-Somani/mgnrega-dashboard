import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PerformanceChart = ({ data }) => {
  const { t } = useTranslation();
  const [zoomed, setZoomed] = useState(false);
  if (!Array.isArray(data)) return null;

  const labels = data.map((r, i) => t(r.month || r.fin_year || `Row ${i}`));
  const values = data.map(r => Number(r.Total_Households_Worked || 0));

  const chartData = {
    labels,
    datasets: [{
      label: t('Total Households Worked'),
      data: values,
      backgroundColor: '#3b82f6'
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: {
          font: { size: zoomed ? 10 : 12 },
          autoSkip: false,
          maxRotation: 90,
          minRotation: 45
        },
        barThickness: zoomed ? 60 : 30,
        categoryPercentage: 1.0,
        barPercentage: 1.0
      },
      y: {
        ticks: {
          font: { size: zoomed ? 12 : 14 }
        },
        beginAtZero: true
      }
    }
  };

  // Chart width: 100px per bar when zoomed, 50px otherwise
  const isCompact = data.length <= 10;
  const chartWidth = isCompact ? '100%' : `${data.length * 60}px`;


  return (
    <div className={`transition-all ${zoomed ? 'fixed inset-0 bg-white z-50 p-4 overflow-auto' : 'mt-6'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{t("Performance Chart")}</h2>
        {!isCompact && (<button
          onClick={() => setZoomed(!zoomed)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {zoomed ? 'Minimize' : 'Maximize'}
        </button>)}
      </div>
      <div className="overflow-x-auto">
        <div style={{ width: chartWidth, height: zoomed ? 'calc(100vh - 120px)' : '400px' }}>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
