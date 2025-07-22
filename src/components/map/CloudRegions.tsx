import { PROVIDER_COLORS } from '@/lib/constants';
import { CloudRegion } from '@/lib/data/cloudRegions';
import { Line } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

interface CloudRegionsProps {
  regions: CloudRegion[];
  visibleProviders: ('aws' | 'gcp' | 'azure')[];
}

export const CloudRegions = ({ regions, visibleProviders }: CloudRegionsProps) => {
  const visibleRegions = useMemo(
    () => regions.filter((r) => visibleProviders.includes(r.provider)),
    [regions, visibleProviders]
  );

  return (
    <>
      {visibleRegions.map((region) => (
        <group key={region.id}>
          {region.coverage.map((area, idx) => (
            <CoverageArea
              key={`${region.id}-${idx}`}
              latitude={area.latitude}
              longitude={area.longitude}
              radius={region.coverageRadius}
              color={PROVIDER_COLORS[region.provider]}
              provider={region.provider}
            />
          ))}
        </group>
      ))}
    </>
  );
};

const CoverageArea = ({
  latitude,
  longitude,
  radius,
  color,
  provider,
}: {
  latitude: number;
  longitude: number;
  radius: number;
  color: string;
  provider: 'aws' | 'gcp' | 'azure';
}) => {
  const earthRadius = 100;
  const segments = 96; // Increased for smoother circles

  const latRad = latitude * (Math.PI / 180);
  const lonRad = longitude * (Math.PI / 180);

  const points = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const angleRadius = (radius / 6371) * (180 / Math.PI);
      const circleLat = latRad + angleRadius * Math.sin(angle);
      const circleLon = lonRad + angleRadius * Math.cos(angle);

      const x = earthRadius * Math.cos(circleLat) * Math.cos(circleLon);
      const y = earthRadius * Math.sin(circleLat);
      const z = earthRadius * Math.cos(circleLat) * Math.sin(circleLon);

      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, [latRad, lonRad, radius]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={provider === 'aws' ? 1.8 : provider === 'gcp' ? 1.6 : 1.4}
      transparent
      opacity={0.8}
      dashed={false}
    />
  );
};