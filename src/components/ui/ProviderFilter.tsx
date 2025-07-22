import { PROVIDER_COLORS, PROVIDER_NAMES } from '@/lib/constants';
import styled from 'styled-components';

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
      <Title>Filter Providers</Title>
      <FilterList>
        {Object.entries(PROVIDER_NAMES).map(([key, name]) => {
          const providerKey = key as 'aws' | 'gcp' | 'azure';
          return (
            <FilterItem
              key={key}
              $active={visibleProviders.includes(providerKey)}
              onClick={() => onToggleProvider(providerKey)}
            >
              <ColorSwatch $color={PROVIDER_COLORS[providerKey]} />
              <ProviderName>{name}</ProviderName>
            </FilterItem>
          );
        })}
      </FilterList>
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  position: absolute;
  top: 20px;
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

const FilterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterItem = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  transition: opacity 0.2s ease;
  padding: 4px 0;

  &:hover {
    opacity: ${({ $active }) => ($active ? 1 : 0.8)};
  }
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