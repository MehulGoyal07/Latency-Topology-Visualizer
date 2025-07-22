/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLatency } from '@/contexts/LatencyContext';
import { PROVIDER_COLORS } from '@/lib/constants';
import { CLOUD_REGIONS, EXCHANGE_SERVERS, ExchangeServer } from '@/lib/data';
import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { AnalyticsPanel } from '../ui/AnalyticsPanel';
import { LatencyToggle } from '../ui/LatencyToggle';
import { Legend } from '../ui/Legend';
import { ProviderFilter } from '../ui/ProviderFilter';
import { CloudRegions } from './CloudRegions';
import { Earth } from './Earth';
import { ExchangeMarker } from './ExchangeMarker';
import { LatencyConnection, LatencyConnectionData } from './LatencyConnection';

const WorldMap = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  const [selectedExchange, setSelectedExchange] = useState<ExchangeServer | null>(null);
  const [hoveredExchange, setHoveredExchange] = useState<ExchangeServer | null>(null);
  const [visibleProviders, setVisibleProviders] = useState<('aws' | 'gcp' | 'azure')[]>(['aws', 'gcp', 'azure']);
  const { latencies } = useLatency();
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
    setSelectedExchange(exchange);
  };

  const handleMarkerHover = (exchange: ExchangeServer | null) => {
    setHoveredExchange(exchange);
  };

  const handleToggleProvider = (provider: 'aws' | 'gcp' | 'azure') => {
    setVisibleProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider]
    );
  };

 const connections = useMemo(() => {
    const conns: LatencyConnectionData[] = [];
    if (!showLatency) return conns;

    EXCHANGE_SERVERS.forEach((exchange) => {
      if (!visibleProviders.includes(exchange.cloudProvider)) return;

      CLOUD_REGIONS.forEach((region) => {
        if (!visibleProviders.includes(region.provider)) return;

        const key = `${exchange.id}-${region.id}`;
        const latency = latencies[key];
        if (!latency) return;

        // Exchange position
        const exLat = exchange.location.latitude * (Math.PI / 180);
        const exLon = exchange.location.longitude * (Math.PI / 180);
        const exX = 101 * Math.cos(exLat) * Math.cos(exLon);
        const exY = 101 * Math.sin(exLat);
        const exZ = 101 * Math.cos(exLat) * Math.sin(exLon);

        // Region position (center of coverage)
        const regionCenter = region.coverage[0];
        const regLat = regionCenter.latitude * (Math.PI / 180);
        const regLon = regionCenter.longitude * (Math.PI / 180);
        const regX = 100 * Math.cos(regLat) * Math.cos(regLon);
        const regY = 100 * Math.sin(regLat);
        const regZ = 100 * Math.cos(regLat) * Math.sin(regLon);

        conns.push({
          from: { x: exX, y: exY, z: exZ },
          to: { x: regX, y: regY, z: regZ },
          latency,
          color: PROVIDER_COLORS[region.provider],
        });
      });
    });

    return conns;
  }, [latencies, showLatency, visibleProviders]); // Added visibleProviders to dependencies

  return (
    <>
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
          <pointLight position={[10, 10, 10]} />
          <Earth />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          {/* Cloud Regions Visualization */}
          <CloudRegions regions={CLOUD_REGIONS} visibleProviders={visibleProviders} />

          {/* Render exchange markers */}
          {EXCHANGE_SERVERS
            .filter((exchange) => visibleProviders.includes(exchange.cloudProvider))
            .map((exchange) => (
              <ExchangeMarker
                key={exchange.id}
                exchange={exchange}
                onClick={handleMarkerClick}
                onHover={handleMarkerHover}
                selected={selectedExchange?.id === exchange.id}
              />
            ))}

          {/* Render latency connections */}
          {connections.map((conn, index) => (
            <LatencyConnection
              key={`${conn.from.x}-${conn.from.y}-${conn.to.x}-${conn.to.y}-${index}`}
              from={conn.from}
              to={conn.to}
              latency={conn.latency}
              visible={true} // Now controlled by connections array
            />
          ))}

          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.6}
            panSpeed={0.5}
            rotateSpeed={0.4}
            minDistance={200}
            maxDistance={500}
          />
        </Canvas>

        <ProviderFilter
          visibleProviders={visibleProviders}
          onToggleProvider={handleToggleProvider}
        />
        <LatencyToggle 
          active={showLatency} 
          onClick={() => setShowLatency(!showLatency)} 
        />
        <Legend />
        <AnalyticsPanel />
      </CanvasContainer>
    </>
  );
};

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

export default WorldMap