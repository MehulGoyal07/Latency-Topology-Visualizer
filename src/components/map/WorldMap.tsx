/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLatency } from '@/contexts/LatencyContext';
import { PROVIDER_COLORS } from '@/lib/constants';
import { CLOUD_REGIONS, EXCHANGE_SERVERS, type ExchangeServer } from '@/lib/data';
import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { AnalyticsPanel } from '../ui/AnalyticsPanel';
import { LatencyToggle } from '../ui/LatencyToggle';
import { Legend } from '../ui/Legend';
import { ProviderFilter } from '../ui/ProviderFilter';
import { CloudRegions } from './CloudRegions';
import { Earth } from './Earth';
import { ExchangeMarker } from './ExchangeMarker';
import { LatencyConnection } from './LatencyConnection';

interface LatencyConnectionData {
  from: THREE.Vector3;
  to: THREE.Vector3;
  latency: number;
  color: string;
}

const WorldMap = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  const [selectedExchange, setSelectedExchange] = useState<ExchangeServer | null>(null);
  const [hoveredExchange, setHoveredExchange] = useState<ExchangeServer | null>(null);
  const [visibleProviders, setVisibleProviders] = useState<Array<'aws' | 'gcp' | 'azure'>>(['aws', 'gcp', 'azure']);
  const { data, loading, error } = useLatency();
  const [showLatency, setShowLatency] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMarkerClick = (exchange: ExchangeServer) => {
    setSelectedExchange(prev => prev?.id === exchange.id ? null : exchange);
  };

  const handleMarkerHover = (exchange: ExchangeServer | null) => {
    setHoveredExchange(exchange);
  };

  const handleToggleProvider = (provider: 'aws' | 'gcp' | 'azure') => {
    setVisibleProviders(prev =>
      prev.includes(provider)
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    );
  };

  const connections = useMemo(() => {
    const conns: LatencyConnectionData[] = [];
    if (!showLatency || !data) return conns;

    EXCHANGE_SERVERS.forEach((exchange) => {
      if (!visibleProviders.includes(exchange.cloudProvider)) return;

      CLOUD_REGIONS.forEach((region) => {
        if (!visibleProviders.includes(region.provider)) return;

        const key = `${exchange.id}-${region.id}`;
        const latency = data.realtime[key];
        if (!latency) return;

        // Convert lat/long to 3D coordinates
        const toSphericalCoords = (lat: number, lon: number, radius: number) => {
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon + 180) * (Math.PI / 180);
          return {
            x: -(radius * Math.sin(phi) * Math.cos(theta)),
            y: radius * Math.cos(phi),
            z: radius * Math.sin(phi) * Math.sin(theta)
          };
        };

        const exchangePos = toSphericalCoords(
          exchange.location.latitude,
          exchange.location.longitude,
          101
        );
        const regionPos = toSphericalCoords(
          region.coverage[0].latitude,
          region.coverage[0].longitude,
          100
        );

        conns.push({
          from: new THREE.Vector3(exchangePos.x, exchangePos.y, exchangePos.z),
          to: new THREE.Vector3(regionPos.x, regionPos.y, regionPos.z),
          latency,
          color: PROVIDER_COLORS[region.provider],
        });
      });
    });

    return conns;
  }, [data, showLatency, visibleProviders]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <CanvasContainer>
      <Canvas
        camera={{
          position: [0, 0, 300],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Earth />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <CloudRegions regions={CLOUD_REGIONS} visibleProviders={visibleProviders} />

        {EXCHANGE_SERVERS
          .filter(exchange => visibleProviders.includes(exchange.cloudProvider))
          .map(exchange => (
            <ExchangeMarker
              key={exchange.id}
              exchange={exchange}
              onClick={handleMarkerClick}
              onHover={handleMarkerHover}
              selected={selectedExchange?.id === exchange.id}
              hovered={hoveredExchange?.id === exchange.id}
            />
          ))}

        {connections.map((conn, index) => (
          <LatencyConnection
            key={`${conn.from.x}-${conn.from.y}-${conn.from.z}-${conn.to.x}-${conn.to.y}-${conn.to.z}-${index}`}
            from={conn.from}
            to={conn.to}
            latency={conn.latency}
            color={conn.color}
          />
        ))}

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.4}
          minDistance={150}
          maxDistance={500}
        />
      </Canvas>

      <ControlPanel>
        <ProviderFilter
          visibleProviders={visibleProviders}
          onToggleProvider={handleToggleProvider}
        />
        <LatencyToggle
          active={showLatency}
          onClick={() => setShowLatency(!showLatency)}
        />
        <Legend />
      </ControlPanel>
      
      <AnalyticsPanel />
    </CanvasContainer>
  );
};

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ControlPanel = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
  z-index: 10;
`;

export default WorldMap;