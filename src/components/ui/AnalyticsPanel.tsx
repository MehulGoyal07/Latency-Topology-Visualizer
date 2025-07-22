// AnalyticsPanel.tsx
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
      <TitleContainer>
        <Title>Latency Analytics</Title>
        <TitleUnderline />
      </TitleContainer>
      
      <PairSelector>
        <Label>Exchange-Region Pair</Label>
        <SelectContainer>
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
          <SelectIcon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </SelectIcon>
        </SelectContainer>
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
                {timeRange === range && <ActiveIndicator />}
              </TimeButton>
            ))}
          </TimeRangeSelector>

          {stats && (
            <StatsContainer>
              <StatBox>
                <StatLabel>Minimum</StatLabel>
                <StatValue>{stats.min.toFixed(1)}ms</StatValue>
                <StatTrend $positive={stats.min < stats.avg}>
                  {stats.min < stats.avg ? '↓' : '↑'} 
                  {Math.abs(((stats.min - stats.avg) / stats.avg * 100)).toFixed(1)}%
                </StatTrend>
              </StatBox>
              <StatBox>
                <StatLabel>Average</StatLabel>
                <StatValue>{stats.avg.toFixed(1)}ms</StatValue>
                <StatTrend $neutral>Baseline</StatTrend>
              </StatBox>
              <StatBox>
                <StatLabel>Maximum</StatLabel>
                <StatValue>{stats.max.toFixed(1)}ms</StatValue>
                <StatTrend $positive={stats.max < stats.avg}>
                  {stats.max < stats.avg ? '↓' : '↑'} 
                  {Math.abs(((stats.max - stats.avg) / stats.avg * 100)).toFixed(1)}%
                </StatTrend>
              </StatBox>
            </StatsContainer>
          )}

          <ChartContainer>
            <HistoricalChart 
              data={data.historical[selectedPair]} 
              timeRange={timeRange} 
            />
          </ChartContainer>
        </>
      )}
    </PanelContainer>
  );
};

// Styled Components
const PanelContainer = styled.div`
  position: relative;
  background: rgba(15, 23, 42, 0.97);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  z-index: 100;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  }
`;

const TitleContainer = styled.div`
  margin-bottom: 1.25rem;
  position: relative;
  display: inline-block;
`;

const Title = styled.h3`
  margin: 0;
  color: #f8fafc;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.3px;
`;

const TitleUnderline = styled.div`
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 100%;
  height: 0.25rem;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 0.25rem;
  opacity: 0.8;
`;

const PairSelector = styled.div`
  margin: 1.25rem 0;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #94a3b8;
  font-weight: 600;
`;

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  background: rgba(30, 41, 59, 0.7);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  appearance: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }

  &::-ms-expand {
    display: none;
  }
`;

const SelectIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #94a3b8;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Option = styled.option`
  background: #1e293b;
  padding: 0.75rem;
  color: #f8fafc;
  font-size: 0.95rem;
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 1.25rem 0;
`;

const TimeButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 0.75rem;
  background: ${({ $active }) => 
    $active ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.7)'};
  color: ${({ $active }) => $active ? '#3b82f6' : '#94a3b8'};
  border: 1px solid ${({ $active }) => 
    $active ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  flex: 1;
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  box-shadow: ${({ $active }) => 
    $active ? '0 2px 12px rgba(59, 130, 246, 0.25)' : 'none'};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;

  &:hover {
    background: ${({ $active }) => 
      $active ? 'rgba(59, 130, 246, 0.3)' : 'rgba(30, 41, 59, 0.8)'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ActiveIndicator = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #3b82f6;
  border-radius: 0 0 8px 8px;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin: 1.25rem 0;
  flex-wrap: wrap;
`;

const StatBox = styled.div`
  flex: 1;
  min-width: calc(33.333% - 0.75rem);
  text-align: center;
  background: rgba(30, 41, 59, 0.7);
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const StatValue = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #3b82f6;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  margin-bottom: 0.5rem;
`;

const StatTrend = styled.div<{ $positive?: boolean; $neutral?: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $positive, $neutral }) => 
    $neutral ? '#94a3b8' : $positive ? '#10b981' : '#ef4444'};
  margin-top: 0.25rem;
`;

const ChartContainer = styled.div`
  margin-top: 1.25rem;
  height: 200px;
`;