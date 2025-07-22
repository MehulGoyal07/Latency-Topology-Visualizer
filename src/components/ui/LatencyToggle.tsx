import styled from 'styled-components';

interface LatencyToggleProps {
  active: boolean;
  onClick: () => void;
}

export const LatencyToggle = ({ active, onClick }: LatencyToggleProps) => {
  return (
    <ToggleContainer>
      <ToggleButton $active={active} onClick={onClick}>
        {active ? (
          <>
            <span>Hide</span>
            <span>Latency</span>
          </>
        ) : (
          <>
            <span>Show</span>
            <span>Latency</span>
          </>
        )}
      </ToggleButton>
      <StatusIndicator $active={active} />
    </ToggleContainer>
  );
};

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => 
    $active ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)'};
  color: ${({ $active }) => $active ? '#4ade80' : '#f87171'};
  border: 1px solid ${({ $active }) => 
    $active ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'};
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;
  min-width: 5rem;

  &:hover {
    background: ${({ $active }) => 
      $active ? 'rgba(74, 222, 128, 0.25)' : 'rgba(248, 113, 113, 0.25)'};
    transform: translateY(-0.125rem);
  }

  &:active {
    transform: translateY(0);
  }

  span {
    display: block;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    min-width: 4.5rem;
    font-size: 0.8125rem;
  }
`;

const StatusIndicator = styled.div<{ $active: boolean }>`
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#4ade80' : '#f87171')};
  box-shadow: 0 0 0 0.25rem ${({ $active }) => 
    ($active ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)')};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 0.75rem;
    height: 0.75rem;
  }
`;