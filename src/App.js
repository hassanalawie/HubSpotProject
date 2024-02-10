import React, { useState, useEffect } from 'react';
import './App.css';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import Chart from 'chart.js/auto';

function App() {
  const [sentimentSummary, setSentimentSummary] = useState({ positive_tickets: 0, negative_tickets: 0 });
  const [metrics, setMetrics] = useState({
    nps_score: 0,
    csat_score: 0,
    ces_score: 0,
    churn_rate: 0,
    retention_rate: 0,
    average_resolution_time: 0,
    first_contact_resolution: 0,
  });
  useEffect(() => {
    // Simulate fetching data
    const fetchSentimentSummary = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/sentiment_summary');
        setSentimentSummary(response.data);
      } catch (error) {
        console.error('Error fetching sentiment summary:', error);
      }
    };

    // Fetch additional metrics data
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/metrics');
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };
  
      fetchSentimentSummary();
      fetchMetrics();

  }, []);

  const totalTickets = sentimentSummary.positive_tickets + sentimentSummary.negative_tickets;
  const data = {
    labels: ['Positive Tickets', 'Negative Tickets'],
    datasets: [
      {
        data: [sentimentSummary.positive_tickets, sentimentSummary.negative_tickets],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
      beforeDraw: (chart) => {
        const width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";

        const text = `${totalTickets} Tickets`,
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;

        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  };
  const npsData = {
    labels: ['NPS Score'],
    datasets: [
      {
        label: 'Net Promoter Score',
        data: [metrics.nps_score],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <div className="App">
    <header className="App-header">
      <h1>Dashboard</h1>
    </header>
    
    <div className="chart-container">
      <Pie data={data} options={options} />
    </div>

    <div className="metrics-container">
      <div className="metric">
        <span className="metric-title">NPS Score:</span>
        <span className="metric-value">{metrics.nps_score}</span>
      </div>
      <div className="metric">
        <span className="metric-title">CSAT Score:</span>
        <span className="metric-value">{metrics.csat_score.toFixed(2)}%</span>
      </div>
      <div className="metric">
        <span className="metric-title">Churn Rate:</span>
        <span className="metric-value">{metrics.churn_rate.toFixed(2)}%</span>
      </div>
      <div className="metric">
        <span className="metric-title">Retention Rate:</span>
        <span className="metric-value">{metrics.retention_rate.toFixed(2)}%</span>
      </div>
      <div className="metric">
        <span className="metric-title">Average Resolution Time:</span>
        <span className="metric-value">{metrics.average_resolution_time.toFixed(2)} min</span>
      </div>
    </div>
    
    <div className="chart-container">
      <Bar data={npsData} options={barOptions} />
    </div>

  </div>
  );
}

export default App;
