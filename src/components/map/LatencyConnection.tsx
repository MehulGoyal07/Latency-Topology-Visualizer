import { Line } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

interface LatencyConnectionProps {
  from: THREE.Vector3;
  to: THREE.Vector3;
  latency: number;
  color?: string;
}

export const LatencyConnection = ({
  from,
  to,
  latency,
  color,
}: LatencyConnectionProps) => {
  const points = useMemo(() => [from, to], [from, to]);

  const lineColor = useMemo(() => {
    if (color) return color;
    return latency < 50 ? '#4ade80' : 
           latency < 100 ? '#fbbf24' : '#f87171';
  }, [latency, color]);

  const dashSize = useMemo(() => {
    return Math.min(1, Math.max(0.2, 1 - (latency / 200)));
  }, [latency]);

  return (
    <Line
      points={points}
      color={lineColor}
      lineWidth={1.5}
      dashed
      dashSize={dashSize}
      gapSize={0.3}
      transparent
      opacity={0.8}
      depthTest={false}
    />
  );
};