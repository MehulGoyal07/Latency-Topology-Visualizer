import { CLOUD_REGIONS } from './cloudRegions';
import { EXCHANGE_SERVERS } from './exchanges';
// Mock latency data generator
export const generateMockLatency = () => {
  const latencies: Record<string, number> = {};

  EXCHANGE_SERVERS.forEach((exchange) => {
    CLOUD_REGIONS.forEach((region) => {
      const key = `${exchange.id}-${region.id}`;
      // Base latency + random fluctuation (20ms-150ms)
      const baseLatency = Math.hypot(
        exchange.location.latitude - region.coverage[0].latitude,
        exchange.location.longitude - region.coverage[0].longitude
      ) * 5;
      latencies[key] = Math.max(20, baseLatency + (Math.random() * 30 - 15));
    });
  });

  return latencies;
};

// Simulate API polling
export const fetchLatencyData = async () => {
  return new Promise<Record<string, number>>((resolve) => {
    setTimeout(() => resolve(generateMockLatency()), 800);
  });
};

// Types
export interface LatencyConnection {
  from: { x: number; y: number; z: number };
  to: { x: number; y: number; z: number };
  latency: number;
  color: string;
}