import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getSalesData } from '../api/salesApi'; // Adjust path if needed
import '../assets/saleGraph.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesGraph = () => {
  const [period, setPeriod] = useState('daily'); // Default to daily
  const [salesData, setSalesData] = useState([]); // Initialize as empty array
  const [totalSales, setTotalSales] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const data = await getSalesData(period);
        console.log('Fetched Sales Data:', data); // Debug: Log data
        if (data && Array.isArray(data.salesData)) {
          setSalesData(data.salesData);
          setTotalSales(data.totalSales || 0);
          setError(null);
        } else {
          setSalesData([]);
          setTotalSales(0);
          setError('Invalid sales data format');
        }
      } catch (err) {
        console.error('Error in fetchSalesData:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(err.message || 'Failed to load sales data');
        setSalesData([]);
        setTotalSales(0);
      } finally {
        setLoading(false);
      }
    };
    fetchSalesData();
  }, [period]);

  const chartData = {
    labels: Array.isArray(salesData) ? salesData.map(item => item.period || 'Unknown') : [],
    datasets: [
      {
        label: 'Total Sales ($)',
        data: Array.isArray(salesData) ? salesData.map(item => item.totalSales || 0) : [],
        backgroundColor: '#ef6c00', // Warm orange
        borderColor: '#c55800', // Darker warm orange
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#3e2723' }, // Dark brown
      },
      title: {
        display: true,
        text: `${period.charAt(0).toUpperCase() + period.slice(1)} Sales`,
        color: '#3e2723', // Dark brown
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#3e2723' }, // Dark brown
        title: { display: true, text: 'Period', color: '#3e2723' },
      },
      y: {
        ticks: { color: '#3e2723' },
        title: { display: true, text: 'Sales ($)', color: '#3e2723' },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="sales-graph">
      <div className="period-selector">
        <button
          onClick={() => setPeriod('daily')}
          style={{ backgroundColor: period === 'daily' ? '#c55800' : '#ef6c00' }}
        >
          Daily
        </button>
        <button
          onClick={() => setPeriod('weekly')}
          style={{ backgroundColor: period === 'weekly' ? '#c55800' : '#ef6c00' }}
        >
          Weekly
        </button>
        <button
          onClick={() => setPeriod('monthly')}
          style={{ backgroundColor: period === 'monthly' ? '#c55800' : '#ef6c00' }}
        >
          Monthly
        </button>
      </div>
      {loading ? (
        <p style={{ color: '#3e2723' }}>Loading sales data...</p>
      ) : error ? (
        <p style={{ color: '#c62828' }}>{error}</p>
      ) : !Array.isArray(salesData) || salesData.length === 0 ? (
        <p style={{ color: '#3e2723' }}>No sales data available for this period</p>
      ) : (
        <div className="chart-container">
          <Bar data={chartData} options={options} />
          <p style={{ color: '#3e2723', marginTop: '10px' }}>
            Total Sales: ${totalSales.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default SalesGraph;