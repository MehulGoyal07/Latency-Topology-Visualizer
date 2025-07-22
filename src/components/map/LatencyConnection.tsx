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
    return latency < 50 ? '#10b981' : 
           latency < 100 ? '#f59e0b' : '#ef4444';
  }, [latency, color]);

  const lineWidth = useMemo(() => {
    return latency < 50 ? 1.8 : 
           latency < 100 ? 1.5 : 1.2;
  }, [latency]);

  const dashSize = useMemo(() => {
    return Math.min(1.2, Math.max(0.3, 1.2 - (latency / 200)));
  }, [latency]);

  const opacity = useMemo(() => {
    return latency < 50 ? 0.9 : 
           latency < 100 ? 0.8 : 0.7;
  }, [latency]);

  return (
    <Line
      points={points}
      color={lineColor}
      lineWidth={lineWidth}
      dashed
      dashSize={dashSize}
      gapSize={0.25}
      transparent
      opacity={opacity}
      depthTest={false}
    />
  );
};