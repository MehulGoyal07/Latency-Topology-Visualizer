import { PROVIDER_COLORS, PROVIDER_NAMES } from '@/lib/constants';
import styled, { keyframes } from 'styled-components';

interface ProviderFilterProps {
  visibleProviders: Array<'aws' | 'gcp' | 'azure'>;
  onToggleProvider: (provider: 'aws' | 'gcp' | 'azure') => void;
}

export const ProviderFilter = ({
  visibleProviders,
  onToggleProvider,
}: ProviderFilterProps) => {
  return (
    <FilterContainer>
      <FilterTitle>Cloud Providers</FilterTitle>
      <FilterList>
        {Object.entries(PROVIDER_NAMES).map(([key, name]) => {
          const providerKey = key as 'aws' | 'gcp' | 'azure';
          const isActive = visibleProviders.includes(providerKey);
          
          return (
            <FilterItem 
              key={key}
              $active={isActive}
              $color={PROVIDER_COLORS[providerKey]}
              onClick={() => onToggleProvider(providerKey)}
            >
              <ProviderContent>
                <ProviderIcon $color={PROVIDER_COLORS[providerKey]} $active={isActive}>
                  {isActive ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : null}
                </ProviderIcon>
                <ProviderName>{name}</ProviderName>
                <ProviderCount $active={isActive}>
                  {isActive ? 'ON' : 'OFF'}
                </ProviderCount>
              </ProviderContent>
            </FilterItem>
          );
        })}
      </FilterList>
    </FilterContainer>
  );
};

// Animations

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const FilterContainer = styled.div`
  position: relative;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 220px;
  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: 768px) {
    padding: 12px;
    min-width: 200px;
  }
`;

const FilterTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const FilterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterItem = styled.li<{ $active: boolean; $color: string }>`
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  overflow: hidden;
  background: ${({ $active, $color }) => 
    $active ? `rgba(${hexToRgb($color)}, 0.15)` : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${({ $active, $color }) => 
    $active ? `rgba(${hexToRgb($color)}, 0.3)` : 'rgba(255, 255, 255, 0.1)'};

  &:hover {
    background: ${({ $active, $color }) => 
      $active ? `rgba(${hexToRgb($color)}, 0.2)` : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ProviderContent = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 14px;
  gap: 12px;
`;

const ProviderIcon = styled.div<{ $active: boolean; $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $active, $color }) => $active ? $color : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ $active }) => $active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  transition: all 0.2s ease;
  flex-shrink: 0;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const ProviderName = styled.span`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  flex-grow: 1;
`;

const ProviderCount = styled.span<{ $active: boolean }>`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ $active }) => $active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
`;

// Helper function to convert hex to rgb
const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};