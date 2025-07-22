import { useLatency } from '@/contexts/LatencyContext';
import { PROVIDER_COLORS } from '@/lib/constants';
import { CLOUD_REGIONS, EXCHANGE_SERVERS, type ExchangeServer } from '@/lib/data';
import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiMenu, FiX } from 'react-icons/fi';
import styled, { keyframes } from 'styled-components';
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
  const [selectedExchange, setSelectedExchange] = useState<ExchangeServer | null>(null);
  const [hoveredExchange, setHoveredExchange] = useState<ExchangeServer | null>(null);
  const [visibleProviders, setVisibleProviders] = useState<Array<'aws' | 'gcp' | 'azure'>>(['aws', 'gcp', 'azure']);
  const { data, loading, error } = useLatency();
  const [showLatency, setShowLatency] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <WorldContainer>
      <Canvas
        camera={{
          position: [0, 0, 300],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          alpha: true
        }}
        dpr={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
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

      <TopBar>
        <AppTitleContainer>
          <AppTitle>GoQuant Latency Visualizer</AppTitle>
          <AppSubtitle>Global Cloud Performance Metrics</AppSubtitle>
        </AppTitleContainer>
        
        <DesktopControls>
          <LatencyToggle
            active={showLatency}
            onClick={() => setShowLatency(!showLatency)}
          />
          
          <NavDropdown>
            <NavItem 
              onClick={() => setShowAnalytics(!showAnalytics)}
              active={showAnalytics}
            >
              Analytics {showAnalytics ? <FiChevronUp /> : <FiChevronDown />}
            </NavItem>
            {showAnalytics && (
              <DropdownContent>
                <AnalyticsPanel />
              </DropdownContent>
            )}
          </NavDropdown>
          
          <NavDropdown>
            <NavItem 
              onClick={() => setShowFilters(!showFilters)}
              active={showFilters}
            >
              Filters {showFilters ? <FiChevronUp /> : <FiChevronDown />}
            </NavItem>
            {showFilters && (
              <DropdownContent>
                <ProviderFilter
                  visibleProviders={visibleProviders}
                  onToggleProvider={handleToggleProvider}
                />
              </DropdownContent>
            )}
          </NavDropdown>
        </DesktopControls>
        
        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </MobileMenuButton>
      </TopBar>

      <MobileMenu open={mobileMenuOpen}>
        <MobileMenuItem onClick={() => {
          setShowAnalytics(!showAnalytics);
          setMobileMenuOpen(false);
        }}>
          Analytics {showAnalytics ? <FiChevronUp /> : <FiChevronDown />}
        </MobileMenuItem>
        <MobileMenuItem onClick={() => {
          setShowFilters(!showFilters);
          setMobileMenuOpen(false);
        }}>
          Filters {showFilters ? <FiChevronUp /> : <FiChevronDown />}
        </MobileMenuItem>
        <MobileMenuItem onClick={() => {
          setShowLatency(!showLatency);
          setMobileMenuOpen(false);
        }}>
          Latency: {showLatency ? 'ON' : 'OFF'}
        </MobileMenuItem>
      </MobileMenu>

      <LegendContainer>
        <Legend />
      </LegendContainer>

      {showAnalytics && (
        <MobileAnalyticsWrapper>
          <AnalyticsPanel />
        </MobileAnalyticsWrapper>
      )}

      {loading && (
        <LoadingOverlay>
          <SpinnerContainer>
            <Spinner />
          </SpinnerContainer>
          <LoadingText>Initializing World Map...</LoadingText>
          <LoadingProgress>Loading data...</LoadingProgress>
        </LoadingOverlay>
      )}

      {error && (
        <ErrorOverlay>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorText>{error}</ErrorText>
          <RetryButton onClick={() => window.location.reload()}>
            Reload Application
          </RetryButton>
        </ErrorOverlay>
      )}
    </WorldContainer>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

// Styled Components
const WorldContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0e17 0%, #1a2639 100%);
`;

const TopBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(16px);
  z-index: 20;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    padding: 1rem 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const AppTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AppTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const AppSubtitle = styled.span`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  margin-top: 0.25rem;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const DesktopControls = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavDropdown = styled.div`
  position: relative;
`;

const NavItem = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  svg {
    transition: transform 0.2s ease;
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(15, 23, 42, 0.97);
  backdrop-filter: blur(16px);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 30;
  width: 350px;
  animation: ${fadeIn} 0.3s ease-out;
  transform-origin: top right;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ open: boolean }>`
  display: none;
  position: absolute;
  top: 80px;
  right: 1rem;
  background: rgba(15, 23, 42, 0.97);
  backdrop-filter: blur(16px);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 20;
  width: calc(100% - 2rem);
  max-width: 300px;
  animation: ${slideIn} 0.3s ease-out;
  transform-origin: top right;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${props => props.open ? 1 : 0};
  pointer-events: ${props => props.open ? 'all' : 'none'};
  transform: ${props => props.open ? 'translateX(0)' : 'translateX(100%)'};

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenuItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const LegendContainer = styled.div`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  z-index: 10;
  animation: ${fadeIn} 0.4s ease-out;

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
  }
`;

const MobileAnalyticsWrapper = styled.div`
  position: absolute;
  bottom: 6rem;
  left: 1rem;
  right: 1rem;
  z-index: 10;
  animation: ${fadeIn} 0.4s ease-out;

  @media (min-width: 769px) {
    display: none;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(10, 14, 23, 0.95);
  z-index: 100;
  backdrop-filter: blur(8px);
`;

const SpinnerContainer = styled.div`
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const Spinner = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid ${PROVIDER_COLORS.aws};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: white;
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
`;

const LoadingProgress = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  margin: 0;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const ErrorOverlay = styled(LoadingOverlay)`
  background: rgba(23, 14, 14, 0.95);
`;

const ErrorIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const ErrorText = styled.p`
  color: #ff6b6b;
  font-size: 1.25rem;
  max-width: 80%;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.5;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    max-width: 90%;
  }
`;

const RetryButton = styled.button`
  padding: 0.875rem 1.75rem;
  background: ${PROVIDER_COLORS.aws};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }
`;

export default WorldMap;