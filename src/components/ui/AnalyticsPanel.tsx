import { useLatency } from '@/contexts/LatencyContext';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { HistoricalChart } from './HistoricalChart';

export const AnalyticsPanel = () => {
  const { data, exchanges, regions } = useLatency();
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');
  const [selectedPair, setSelectedPair] = useState<string | null>(null);

  const stats = useMemo(() => {
    if (!selectedPair || !data?.historical[selectedPair]) return null;
    
    const historicalData = data.historical[selectedPair];
    const cutoff = Date.now() - (
      timeRange === '1h' ? 3600000 : 
      timeRange === '24h' ? 86400000 : 
      604800000
    );

    const filtered = historicalData.filter(d => d.timestamp >= cutoff);
    if (filtered.length === 0) return null;

    return {
      min: Math.min(...filtered.map(d => d.latency)),
      max: Math.max(...filtered.map(d => d.latency)),
      avg: filtered.reduce((sum, d) => sum + d.latency, 0) / filtered.length,
    };
  }, [selectedPair, timeRange, data]);

  return (
    <PanelContainer>
      <Title>Latency Analytics</Title>
      
      <PairSelector>
        <Label>Exchange-Region Pair:</Label>
        <Select 
          onChange={(e) => setSelectedPair(e.target.value || null)}
          value={selectedPair || ''}
        >
          <Option value="">Select a pair</Option>
          {exchanges.map((ex) => (
            regions.map((reg) => (
              <Option 
                key={`${ex.id}-${reg.id}`} 
                value={`${ex.id}-${reg.id}`}
              >
                {ex.name} → {reg.name}
              </Option>
            ))
          ))}
        </Select>
      </PairSelector>

      {selectedPair && data?.historical[selectedPair] && (
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

          {stats && (
            <StatsContainer>
              <StatBox>
                <StatLabel>Min</StatLabel>
                <StatValue>{stats.min.toFixed(1)}ms</StatValue>
              </StatBox>
              <StatBox>
                <StatLabel>Avg</StatLabel>
                <StatValue>{stats.avg.toFixed(1)}ms</StatValue>
              </StatBox>
              <StatBox>
                <StatLabel>Max</StatLabel>
                <StatValue>{stats.max.toFixed(1)}ms</StatValue>
              </StatBox>
            </StatsContainer>
          )}

          <HistoricalChart 
            data={data.historical[selectedPair]} 
            timeRange={timeRange} 
          />
        </>
      )}
    </PanelContainer>
  );
};

const PanelContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 500px;
  max-width: 90vw;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 8px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 100;
`;

const Title = styled.h3`
  margin: 0 0 16px 0;
  color: #e0e0e0;
  font-size: 1.1rem;
`;

const PairSelector = styled.div`
  margin: 16px 0;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #b0b0b0;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  background: rgba(50, 50, 50, 0.5);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  font-size: 0.9rem;
`;

const Option = styled.option`
  background: #333;
  padding: 8px;
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin: 16px 0;
`;

const TimeButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  background: ${({ $active }) => 
    $active ? 'rgba(63, 81, 181, 0.3)' : 'rgba(50, 50, 50, 0.5)'};
  color: white;
  border: 1px solid ${({ $active }) => 
    $active ? 'rgba(63, 81, 181, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active }) => 
      $active ? 'rgba(63, 81, 181, 0.4)' : 'rgba(70, 70, 70, 0.5)'};
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin: 16px 0;
`;

const StatBox = styled.div`
  flex: 1;
  text-align: center;
  background: rgba(50, 50, 50, 0.3);
  padding: 12px;
  border-radius: 6px;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #b0b0b0;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #3f51b5;
`;