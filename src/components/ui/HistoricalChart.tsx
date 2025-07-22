import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
  Title
);

interface HistoricalChartProps {
  data: Array<{ timestamp: number; latency: number }>;
  timeRange: '1h' | '24h' | '7d';
}

export const HistoricalChart = ({ data, timeRange }: HistoricalChartProps) => {
  const now = Date.now();
  const cutoff = now - (
    timeRange === '1h' ? 3600000 : 
    timeRange === '24h' ? 86400000 : 
    604800000
  );

  const filteredData = data.filter(point => point.timestamp >= cutoff);

  const chartData = {
    datasets: [{
      label: 'Latency (ms)',
      data: filteredData.map(d => ({ x: d.timestamp, y: d.latency })),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: '#3b82f6',
      fill: true,
    }]
  };

  return (
    <ChartContainer>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              titleColor: '#f8fafc',
              bodyColor: '#e2e8f0',
              callbacks: {
                label: (context) => `${context.parsed.y.toFixed(1)}ms`,
              }
            }
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: timeRange === '1h' ? 'minute' : 
                      timeRange === '24h' ? 'hour' : 'day',
                displayFormats: {
                  minute: 'HH:mm',
                  hour: 'HH:mm',
                  day: 'MMM d'
                }
              },
              grid: { 
                color: 'rgba(255, 255, 255, 0.05)',
              },
              ticks: { 
                color: '#94a3b8',
                font: {
                  size: window.innerWidth < 768 ? 10 : 12
                }
              }
            },
            y: { 
              title: { 
                display: true, 
                text: 'Latency (ms)',
                color: '#94a3b8',
                font: {
                  size: window.innerWidth < 768 ? 10 : 12
                }
              },
              grid: { 
                color: 'rgba(255, 255, 255, 0.05)',
              },
              ticks: { 
                color: '#94a3b8',
                font: {
                  size: window.innerWidth < 768 ? 10 : 12
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }}
      />
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  height: 12.5rem;
  margin-top: 1.25rem;
  background: rgba(30, 41, 59, 0.7);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    height: 11rem;
    padding: 0.75rem;
  }

  @media (max-width: 480px) {
    height: 10rem;
  }
`;