/* eslint-disable @typescript-eslint/no-explicit-any */
import { PROVIDER_COLORS, PROVIDER_NAMES } from '@/lib/constants';
import styled from 'styled-components';

interface ProviderFilterProps {
  visibleProviders: ('aws' | 'gcp' | 'azure')[];
  onToggleProvider: (provider: 'aws' | 'gcp' | 'azure') => void;
}

export const ProviderFilter = ({
  visibleProviders,
  onToggleProvider,
}: ProviderFilterProps) => {
  return (
    <FilterContainer>
      <h3>Filter Providers</h3>
      <FilterList>
        {Object.entries(PROVIDER_NAMES).map(([key, name]) => (
          <FilterItem
            key={key}
            $active={visibleProviders.includes(key as any)}
            onClick={() => onToggleProvider(key as any)}
          >
            <ColorSwatch color={PROVIDER_COLORS[key as keyof typeof PROVIDER_NAMES]} />
            <span>{name}</span>
          </FilterItem>
        ))}
      </FilterList>
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  position: absolute;
  top: 20px;
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

const FilterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FilterItem = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  margin: 6px 0;
  font-size: 0.9rem;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  transition: opacity 0.2s;

  &:hover {
    opacity: ${({ $active }) => ($active ? 1 : 0.8)};
  }
`;

const ColorSwatch = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  margin-right: 8px;
`;