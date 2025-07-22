import { PROVIDER_COLORS, PROVIDER_NAMES } from '@/lib/constants';
import type { ExchangeServer } from '@/lib/data/exchange';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import * as THREE from 'three';

interface ExchangeMarkerProps {
  exchange: ExchangeServer;
  onClick: (exchange: ExchangeServer) => void;
  onHover: (exchange: ExchangeServer | null) => void;
  selected?: boolean;
  hovered?: boolean;
}

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

export const ExchangeMarker = ({
  exchange,
  onClick,
  onHover,
  selected = false,
  hovered = false,
}: ExchangeMarkerProps) => {
  const markerRef = useRef<THREE.Mesh>(null);
  const color = PROVIDER_COLORS[exchange.cloudProvider];
  const size = selected ? 1.8 : hovered ? 1.4 : 1;

  const position = useMemo(() => {
    const phi = (90 - exchange.location.latitude) * (Math.PI / 180);
    const theta = (exchange.location.longitude + 180) * (Math.PI / 180);
    const radius = 101;

    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }, [exchange.location]);

  useFrame(({ clock }) => {
    if (markerRef.current) {
      const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.1;
      const scale = size + pulse;
      markerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={markerRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(exchange);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(exchange);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(null);
        }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 1 : hovered ? 0.7 : 0.4}
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.9}
        />
      </mesh>

      {(hovered || selected) && (
        <Html
          distanceFactor={50}
          position={[0, 1.8, 0]}
          style={{
            pointerEvents: 'none',
            transform: 'translateX(-50%)',
          }}
          zIndexRange={[100, 0]}
        >
          <Tooltip $provider={exchange.cloudProvider}>
            <Header>
              <ProviderBadge $provider={exchange.cloudProvider}>
                {PROVIDER_NAMES[exchange.cloudProvider]}
              </ProviderBadge>
              <h3>{exchange.name}</h3>
            </Header>
            <Content>
              <Location>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
                {exchange.location.city}, {exchange.location.country}
              </Location>
              {selected && (
                <LatencyInfo>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor"/>
                    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
                  </svg>
                  {exchange.latency?.toFixed(1)}ms latency
                </LatencyInfo>
              )}
            </Content>
          </Tooltip>
        </Html>
      )}
    </group>
  );
};

const Tooltip = styled.div<{ $provider: 'aws' | 'gcp' | 'azure' }>`
  background: rgba(15, 23, 30, 0.95);
  color: white;
  padding: 0;
  border-radius: 8px;
  width: 240px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: ${pulseAnimation} 2s ease-in-out infinite;
`;

const Header = styled.div`
  padding: 12px 16px;
  background: #0a0a0a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    margin: 8px 0 0 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
  }
`;

const ProviderBadge = styled.span<{ $provider: 'aws' | 'gcp' | 'azure' }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ $provider }) => PROVIDER_COLORS[$provider]};
  color: white;
`;

const Content = styled.div`
  padding: 12px 16px;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #e0e0e0;
  margin-bottom: 8px;

  svg {
    opacity: 0.8;
  }
`;

const LatencyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #e0e0e0;
  margin-top: 8px;

  svg {
    opacity: 0.8;
  }
`;