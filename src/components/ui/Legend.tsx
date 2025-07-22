import { PROVIDER_COLORS, PROVIDER_NAMES } from '@/lib/constants';
import styled from 'styled-components';

export const Legend = () => {
  return (
    <LegendContainer>
      <Title>Exchange Providers</Title>
      <LegendList>
        {Object.entries(PROVIDER_NAMES).map(([key, name]) => (
          <LegendItem key={key}>
            <ColorSwatch $color={PROVIDER_COLORS[key as keyof typeof PROVIDER_NAMES]} />
            <ProviderName>{name}</ProviderName>
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
  background: rgba(0, 0, 0, 0.8);
  padding: 16px;
  border-radius: 8px;
  z-index: 100;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1rem;
  color: #e0e0e0;
`;

const LegendList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LegendItem = styled.li`
  display: flex;
  align-items: center;
`;

const ColorSwatch = styled.div<{ $color: string }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  margin-right: 10px;
  flex-shrink: 0;
`;

const ProviderName = styled.span`
  font-size: 0.9rem;
  color: #e0e0e0;
`;