import { PROVIDER_COLORS, PROVIDER_NAMES } from '@/lib/constants';
import { ExchangeServer } from '@/lib/data/exchanges';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';

interface ExchangeMarkerProps {
  exchange: ExchangeServer;
  onClick: (exchange: ExchangeServer) => void;
  onHover: (exchange: ExchangeServer | null) => void;
  selected?: boolean;
}

export const ExchangeMarker = ({
  exchange,
  onClick,
  onHover,
  selected = false,
}: ExchangeMarkerProps) => {
  const markerRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const color = PROVIDER_COLORS[exchange.cloudProvider];
  const size = selected ? 1.5 : hovered ? 1.2 : 1;

  // Convert lat/long to 3D position
  const lat = exchange.location.latitude * (Math.PI / 180);
  const long = exchange.location.longitude * (Math.PI / 180);
  const radius = 101; // Slightly above Earth surface

  const x = radius * Math.cos(lat) * Math.cos(long);
  const y = radius * Math.sin(lat);
  const z = radius * Math.cos(lat) * Math.sin(long);

  // Pulsing animation
  useFrame(({ clock }) => {
    if (markerRef.current) {
      markerRef.current.scale.x = size + Math.sin(clock.getElapsedTime() * 3) * 0.1;
      markerRef.current.scale.y = size + Math.sin(clock.getElapsedTime() * 3) * 0.1;
      markerRef.current.scale.z = size + Math.sin(clock.getElapsedTime() * 3) * 0.1;
    }
  });

  return (
    <mesh
      ref={markerRef}
      position={[x, y, z]}
      onClick={() => onClick(exchange)}
      onPointerOver={() => {
        setHovered(true);
        onHover(exchange);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered || selected ? 0.5 : 0.2}
        metalness={0.8}
        roughness={0.2}
      />
      {(hovered || selected) && (
        <Html distanceFactor={50} position={[0, 1.5, 0]}>
          <Tooltip>
            <h3>{exchange.name}</h3>
            <p>
              {exchange.location.city}, {exchange.location.country}
            </p>
            <p>Provider: {PROVIDER_NAMES[exchange.cloudProvider]}</p>
          </Tooltip>
        </Html>
      )}
    </mesh>
  );
};

const Tooltip = styled.div`
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px;
  border-radius: 4px;
  width: 200px;
  pointer-events: none;
  transform: translateX(-50%);

  h3 {
    margin: 0 0 4px 0;
    color: #3f51b5;
  }

  p {
    margin: 4px 0;
    font-size: 0.9rem;
  }
`;