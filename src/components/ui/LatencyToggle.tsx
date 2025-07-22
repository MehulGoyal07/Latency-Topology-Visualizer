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
  gap: 10px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => 
    $active ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  color: white;
  border: 1px solid ${({ $active }) => 
    $active ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)'};
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);

  &:hover {
    background: ${({ $active }) => 
      $active ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};
  }
`;

const StatusIndicator = styled.div<{ $active: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#4CAF50' : '#F44336')};
  box-shadow: 0 0 8px ${({ $active }) => 
    ($active ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)')};
`;