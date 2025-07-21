import { Line } from '@react-three/drei';
import * as THREE from 'three';

export interface LatencyConnectionData {
  from: { x: number; y: number; z: number };
  to: { x: number; y: number; z: number };
  latency: number;
  color: string;
}

interface LatencyConnectionProps {
  from: { x: number; y: number; z: number };
  to: { x: number; y: number; z: number };
  latency: number;
  visible: boolean;
}

export const LatencyConnection = ({
  from,
  to,
  latency,
  visible,
}: LatencyConnectionProps) => {
  const points = [
    new THREE.Vector3(from.x, from.y, from.z),
    new THREE.Vector3(to.x, to.y, to.z)
  ];

  // Color based on latency
  const color = latency < 50 ? '#4CAF50' : 
               latency < 100 ? '#FFC107' : '#F44336';

  return (
    <Line
      points={points}
      color={color}
      lineWidth={visible ? 1.2 : 0}
      dashed
      dashSize={0.5}
      gapSize={0.2}
      transparent
      opacity={visible ? 0.8 : 0}
    />
  );
};