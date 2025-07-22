import { PROVIDER_COLORS, PROVIDER_NAMES } from '@/lib/constants';
import styled, { keyframes } from 'styled-components';

export const Legend = () => {
  return (
    <LegendContainer>
      <Title>Network Providers</Title>
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

// Animations
const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// Styled Components
const LegendContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: rgba(15, 23, 42, 0.95);
  padding: 16px;
  border-radius: 12px;
  z-index: 100;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: ${slideIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  max-width: 220px;
  transition: all 0.3s ease;

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    bottom: 16px;
    right: 16px;
    left: 16px;
    max-width: none;
    width: auto;
  }

  /* Small mobile devices */
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Title = styled.h3`
  margin: 0 0 12px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${PROVIDER_COLORS.aws};
    margin-right: 8px;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 8px;
  }
`;

const LegendList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  @media (min-width: 480px) {
    gap: 8px;
  }
`;

const LegendItem = styled.li`
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(4px);
  }
`;

const ColorSwatch = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background-color: ${({ $color }) => $color};
  margin-right: 12px;
  flex-shrink: 0;
  box-shadow: 0 0 8px ${({ $color }) => $color}80;
  transition: all 0.3s ease;

  ${LegendItem}:hover & {
    transform: scale(1.2);
    box-shadow: 0 0 12px ${({ $color }) => $color};
  }

  @media (max-width: 480px) {
    width: 10px;
    height: 10px;
    margin-right: 10px;
  }
`;

const ProviderName = styled.span`
  font-size: 0.9rem;
  color: #e0e0e0;
  font-weight: 400;
  transition: color 0.2s ease;

  ${LegendItem}:hover & {
    color: white;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;