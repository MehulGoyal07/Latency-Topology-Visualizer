import { useLatency } from '@/contexts/LatencyContext';
import { PROVIDER_COLORS } from '@/lib/constants';
import { CLOUD_REGIONS, EXCHANGE_SERVERS, type ExchangeServer } from '@/lib/data';
import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiInfo, FiMenu, FiX } from 'react-icons/fi';
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
          <NavItem 
            onClick={() => setShowAnalytics(!showAnalytics)}
            $active={showAnalytics}
          >
            Analytics {showAnalytics ? <FiChevronUp /> : <FiChevronDown />}
          </NavItem>
          
          <NavItem 
            onClick={() => setShowFilters(!showFilters)}
            $active={showFilters}
          >
            Filters {showFilters ? <FiChevronUp /> : <FiChevronDown />}
          </NavItem>
          
          <LatencyToggle
            active={showLatency}
            onClick={() => setShowLatency(!showLatency)}
          />
        </DesktopControls>
        
        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </MobileMenuButton>
      </TopBar>

      <MobileMenu $open={mobileMenuOpen}>
        <MobileMenuItem 
          onClick={() => {
            setShowAnalytics(!showAnalytics);
            setMobileMenuOpen(false);
          }}
          $active={showAnalytics}
        >
          Analytics {showAnalytics ? <FiChevronUp /> : <FiChevronDown />}
        </MobileMenuItem>
        <MobileMenuItem 
          onClick={() => {
            setShowFilters(!showFilters);
            setMobileMenuOpen(false);
          }}
          $active={showFilters}
        >
          Filters {showFilters ? <FiChevronUp /> : <FiChevronDown />}
        </MobileMenuItem>
        <MobileMenuItem 
          onClick={() => {
            setShowLatency(!showLatency);
            setMobileMenuOpen(false);
          }}
          $active={showLatency}
        >
          Latency: {showLatency ? 'ON' : 'OFF'}
        </MobileMenuItem>
      </MobileMenu>

      {/* Centered Analytics Panel */}
      {showAnalytics && (
        <CenteredPanel $type="analytics">
          <PanelHeader>
            <h3>Latency Analytics</h3>
            <CloseButton onClick={() => setShowAnalytics(false)}>
              <FiX size={20} />
            </CloseButton>
          </PanelHeader>
          <PanelContent>
            <AnalyticsPanel />
          </PanelContent>
        </CenteredPanel>
      )}

      {/* Centered Filters Panel */}
      {showFilters && (
        <CenteredPanel $type="filters">
          <PanelHeader>
            <h3>Cloud Providers</h3>
            <CloseButton onClick={() => setShowFilters(false)}>
              <FiX size={20} />
            </CloseButton>
          </PanelHeader>
          <PanelContent>
            <ProviderFilter
              visibleProviders={visibleProviders}
              onToggleProvider={handleToggleProvider}
            />
          </PanelContent>
        </CenteredPanel>
      )}

      {/* Server Details Panel */}
      {hoveredExchange && (
        <ServerDetailsPanel>
          <DetailsHeader>
            <FiInfo size={18} />
            <h4>Server Details</h4>
            <CloseButton onClick={() => setHoveredExchange(null)}>
              <FiX size={18} />
            </CloseButton>
          </DetailsHeader>
          <DetailsContent>
            <DetailRow>
              <span>Name:</span>
              <strong>{hoveredExchange.name}</strong>
            </DetailRow>
            <DetailRow>
              <span>Provider:</span>
              <strong>{hoveredExchange.cloudProvider.toUpperCase()}</strong>
            </DetailRow>
            <DetailRow>
              <span>Location:</span>
              <strong>{hoveredExchange.location.city}, {hoveredExchange.location.country}</strong>
            </DetailRow>
            <DetailRow>
              <span>Coordinates:</span>
              <strong>{hoveredExchange.location.latitude.toFixed(2)}°, {hoveredExchange.location.longitude.toFixed(2)}°</strong>
            </DetailRow>
          </DetailsContent>
        </ServerDetailsPanel>
      )}

      <LegendContainer>
        <Legend />
      </LegendContainer>

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
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
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
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 20;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 1024px) {
    padding: 1rem 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
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
  background: linear-gradient(90deg, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;

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

const NavItem = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? 'rgba(59, 130, 246, 0.15)' : 'transparent'};
  border: none;
  color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.8)'};
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none'};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateY(-1px);
  }

  svg {
    transition: transform 0.3s ease;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled.div<{ $open: boolean }>`
  display: none;
  position: fixed;
  top: 80px;
  right: 1rem;
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 14px;
  padding: 1rem 0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 20;
  width: 280px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: ${props => props.$open ? 1 : 0};
  pointer-events: ${props => props.$open ? 'all' : 'none'};
  transform: ${props => props.$open ? 'translateX(0) scale(1)' : 'translateX(20px) scale(0.95)'};

  @media (max-width: 768px) {
    display: block;
  }

  @media (max-width: 480px) {
    width: calc(100% - 2rem);
    right: 1rem;
    left: 1rem;
  }
`;

const MobileMenuItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  background: ${props => props.$active ? 'rgba(59, 130, 246, 0.15)' : 'transparent'};
  border: none;
  color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.8)'};
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CenteredPanel = styled.div<{ $type: 'analytics' | 'filters' }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(90vw, ${props => props.$type === 'analytics' ? '800px' : '500px'});
  max-height: 80vh;
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  overflow: hidden;
  z-index: 30;
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 768px) {
    width: 95vw;
    max-height: 70vh;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: rgba(30, 41, 59, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
  }
`;

const PanelContent = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex-grow: 1;
`;

const ServerDetailsPanel = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 20;
  width: 300px;
  animation: ${fadeIn} 0.3s ease-out;
  overflow: hidden;

  @media (max-width: 768px) {
    left: 1rem;
    bottom: 1rem;
    width: calc(100% - 2rem);
  }
`;

const DetailsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  background: rgba(30, 41, 59, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: white;
    flex-grow: 1;
  }

  svg {
    color: ${PROVIDER_COLORS.aws};
  }
`;

const DetailsContent = styled.div`
  padding: 1.25rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;

  span {
    color: rgba(255, 255, 255, 0.7);
  }

  strong {
    color: white;
    font-weight: 500;
    text-align: right;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: rotate(90deg);
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
  background: rgba(10, 14, 23, 0.98);
  z-index: 100;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const SpinnerContainer = styled.div`
  width: 5rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const Spinner = styled.div`
  width: 4rem;
  height: 4rem;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid ${PROVIDER_COLORS.aws};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
`;

const LoadingText = styled.p`
  color: white;
  font-size: 1.4rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  text-align: center;
  max-width: 80%;
  line-height: 1.4;
`;

const LoadingProgress = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin: 0;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const ErrorOverlay = styled(LoadingOverlay)`
  background: rgba(23, 14, 14, 0.98);
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const ErrorText = styled.p`
  color: #ff6b6b;
  font-size: 1.3rem;
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
  padding: 1rem 2rem;
  background: ${PROVIDER_COLORS.aws};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
  }
`;

export default WorldMap;