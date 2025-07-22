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
      borderColor: '#3f51b5',
      backgroundColor: 'rgba(63, 81, 181, 0.1)',
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: '#3f51b5',
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
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: '#b0b0b0' }
            },
            y: { 
              title: { 
                display: true, 
                text: 'Latency (ms)',
                color: '#b0b0b0'
              },
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: '#b0b0b0' }
            }
          }
        }}
      />
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  height: 200px;
  margin-top: 20px;
  background: rgba(30, 30, 30, 0.5);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;