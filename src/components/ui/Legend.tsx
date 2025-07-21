import { PROVIDER_COLORS, PROVIDER_NAMES } from '@/lib/constants';
import styled from 'styled-components';

export const Legend = () => {
  return (
    <LegendContainer>
      <h3>Exchange Providers</h3>
      <LegendList>
        {Object.entries(PROVIDER_NAMES).map(([key, name]) => (
          <LegendItem key={key}>
            <ColorSwatch color={PROVIDER_COLORS[key as keyof typeof PROVIDER_NAMES]} />
            <span>{name}</span>
          </LegendItem>
        ))}
      </LegendList>
    </LegendContainer>
  );
};

const LegendContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 12px;
  border-radius: 8px;
  z-index: 100;
  backdrop-filter: blur(5px);

  h3 {
    margin: 0 0 8px 0;
    font-size: 1rem;
  }
`;

const LegendList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LegendItem = styled.li`
  display: flex;
  align-items: center;
  margin: 6px 0;
  font-size: 0.9rem;
`;

const ColorSwatch = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  margin-right: 8px;
`;