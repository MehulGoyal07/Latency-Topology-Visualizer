import { PROVIDER_COLORS, PROVIDER_NAMES } from '@/lib/constants';
import type { ExchangeServer } from '@/lib/data/exchange';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';

interface ExchangeMarkerProps {
  exchange: ExchangeServer;
  onClick: (exchange: ExchangeServer) => void;
  onHover: (exchange: ExchangeServer | null) => void;
  selected?: boolean;
  hovered?: boolean;
}

export const ExchangeMarker = ({
  exchange,
  onClick,
  onHover,
  selected = false,
  hovered = false,
}: ExchangeMarkerProps) => {
  const markerRef = useRef<THREE.Mesh>(null);
  const color = PROVIDER_COLORS[exchange.cloudProvider];
  const size = selected ? 1.5 : hovered ? 1.2 : 1;

  // Convert to spherical coordinates
  const position = useMemo(() => {
    const phi = (90 - exchange.location.latitude) * (Math.PI / 180);
    const theta = (exchange.location.longitude + 180) * (Math.PI / 180);
    const radius = 101; // Slightly above Earth surface

    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }, [exchange.location]);

  // Pulsing animation
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
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 0.8 : hovered ? 0.6 : 0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {(hovered || selected) && (
        <Html
          distanceFactor={50}
          position={[0, 1.5, 0]}
          style={{
            pointerEvents: 'none',
            transform: 'translateX(-50%)',
          }}
        >
          <Tooltip>
            <h3>{exchange.name}</h3>
            <p>{exchange.location.city}, {exchange.location.country}</p>
            <p>Provider: {PROVIDER_NAMES[exchange.cloudProvider]}</p>
            {selected && <p>Latency: {exchange.latency?.toFixed(1)}ms</p>}
          </Tooltip>
        </Html>
      )}
    </group>
  );
};

const Tooltip = styled.div`
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 12px;
  border-radius: 6px;
  width: 220px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  h3 {
    margin: 0 0 6px 0;
    color: ${PROVIDER_COLORS.aws};
    font-size: 1.1rem;
  }

  p {
    margin: 4px 0;
    font-size: 0.9rem;
    color: #e0e0e0;
  }
`;