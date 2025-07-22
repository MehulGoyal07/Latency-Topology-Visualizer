import {
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Tooltip
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { styled } from 'styled-components';

ChartJS.register(LinearScale, PointElement, LineElement, TimeScale, Tooltip, Legend);

interface HistoricalChartProps {
  data: Array<{ timestamp: number; latency: number }>;
  timeRange: '1h' | '24h' | '7d';
}

export const HistoricalChart = ({ data, timeRange }: HistoricalChartProps) => {
  // Filter data based on time range
  const now = Date.now();
  const filteredData = data.filter((point) => {
    const cutoff = timeRange === '1h' ? 3600000 : 
                  timeRange === '24h' ? 86400000 : 604800000;
    return point.timestamp >= now - cutoff;
  });

  const chartData = {
    datasets: [{
      label: 'Latency (ms)',
      data: filteredData.map((d) => ({ x: d.timestamp, y: d.latency })),
      borderColor: '#3f51b5',
      backgroundColor: 'rgba(63, 81, 181, 0.1)',
      tension: 0.3,
      pointRadius: 2,
    }]
  };

  return (
    <ChartContainer>
      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: timeRange === '1h' ? 'minute' : 
                      timeRange === '24h' ? 'hour' : 'day',
              },
            },
            y: { title: { display: true, text: 'Latency (ms)' } }
          }
        }}
      />
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
`;