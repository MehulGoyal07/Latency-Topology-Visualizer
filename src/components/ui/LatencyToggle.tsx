import styled from 'styled-components';

interface LatencyToggleProps {
  active: boolean;
  onClick: () => void;
}

export const LatencyToggle = ({ active, onClick }: LatencyToggleProps) => {
  return (
    <ToggleContainer>
      <ToggleButton $active={active} onClick={onClick}>
        {active ? 'Hide Latency' : 'Show Latency'}
      </ToggleButton>
      <StatusIndicator $active={active} />
    </ToggleContainer>
  );
};

const ToggleContainer = styled.div`
  position: absolute;
  bottom: 80px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(50, 50, 50, 0.7);
  }
`;

const StatusIndicator = styled.div<{ $active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#4CAF50' : '#F44336')};
  box-shadow: 0 0 5px ${({ $active }) => ($active ? '#4CAF50' : '#F44336')};
`;