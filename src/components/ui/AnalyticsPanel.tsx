import { CLOUD_REGIONS, EXCHANGE_SERVERS } from '@/lib/data';
import { HISTORICAL_DATA } from '@/lib/data/historicalLatency';
import { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { HistoricalChart } from './HistoricalChart';

export const AnalyticsPanel = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');
  const [selectedPair, setSelectedPair] = useState<string | null>(null);

  // Calculate stats
  const stats = useMemo(() => {
    if (!selectedPair) return null;
    const data = HISTORICAL_DATA[selectedPair];
    const filtered = data.filter((d) => {
      const cutoff = timeRange === '1h' ? 3600000 : 
                    timeRange === '24h' ? 86400000 : 604800000;
      return d.timestamp >= Date.now() - cutoff;
    });
    
    return {
      min: Math.min(...filtered.map((d) => d.latency)),
      max: Math.max(...filtered.map((d) => d.latency)),
      avg: filtered.reduce((sum, d) => sum + d.latency, 0) / filtered.length,
    };
  }, [selectedPair, timeRange]);

  return (
    <PanelContainer>
      <h3>Historical Latency</h3>
      
      <PairSelector>
        <label>Exchange-Region Pair:</label>
        <select 
          onChange={(e) => setSelectedPair(e.target.value)}
          value={selectedPair || ''}
        >
          <option value="">Select a pair</option>
          {EXCHANGE_SERVERS.map((ex) => (
            CLOUD_REGIONS.map((reg) => (
              <option 
                key={`${ex.id}-${reg.id}`} 
                value={`${ex.id}-${reg.id}`}
              >
                {ex.name} → {reg.name}
              </option>
            ))
          ))}
        </select>
      </PairSelector>

      {selectedPair && (
        <>
          <TimeRangeSelector>
            {(['1h', '24h', '7d'] as const).map((range) => (
              <TimeButton
                key={range}
                $active={timeRange === range}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </TimeButton>
            ))}
          </TimeRangeSelector>

          <StatsContainer>
            <StatBox>
              <div>Min</div>
              <StatValue>{stats?.min.toFixed(1)}ms</StatValue>
            </StatBox>
            <StatBox>
              <div>Avg</div>
              <StatValue>{stats?.avg.toFixed(1)}ms</StatValue>
            </StatBox>
            <StatBox>
              <div>Max</div>
              <StatValue>{stats?.max.toFixed(1)}ms</StatValue>
            </StatBox>
          </StatsContainer>

          <HistoricalChart 
            data={HISTORICAL_DATA[selectedPair]} 
            timeRange={timeRange} 
          />
        </>
      )}
    </PanelContainer>
  );
};

// Styled components
const PanelContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 500px;
  background: rgba(0, 0, 0, 0.7);
  padding: 16px;
  border-radius: 8px;
  backdrop-filter: blur(5px);
  z-index: 100;
`;

const PairSelector = styled.div`
  margin: 12px 0;
  
  select {
    margin-left: 8px;
    padding: 4px;
    background: #333;
    color: white;
    border: none;
    border-radius: 4px;
  }
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin: 12px 0;
`;

const TimeButton = styled.button<{ $active: boolean }>`
  padding: 4px 8px;
  background: ${({ $active }) => $active ? '#3f51b5' : '#333'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin: 12px 0;
`;

const StatBox = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #3f51b5;
`;