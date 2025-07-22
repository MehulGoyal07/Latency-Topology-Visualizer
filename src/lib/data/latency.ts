// import { CLOUD_REGIONS } from './cloudRegions';
// import { EXCHANGE_SERVERS } from './exchanges';
// // Mock latency data generator
// export const generateMockLatency = () => {
//   const latencies: Record<string, number> = {};

//   EXCHANGE_SERVERS.forEach((exchange) => {
//     CLOUD_REGIONS.forEach((region) => {
//       const key = `${exchange.id}-${region.id}`;
//       // Base latency + random fluctuation (20ms-150ms)
//       const baseLatency = Math.hypot(
//         exchange.location.latitude - region.coverage[0].latitude,
//         exchange.location.longitude - region.coverage[0].longitude
//       ) * 5;
//       latencies[key] = Math.max(20, baseLatency + (Math.random() * 30 - 15));
//     });
//   });

//   return latencies;
// };

// // Simulate API polling
// export const fetchLatencyData = async () => {
//   return new Promise<Record<string, number>>((resolve) => {
//     setTimeout(() => resolve(generateMockLatency()), 800);
//   });
// };

// // Types
// export interface LatencyConnection {
//   from: { x: number; y: number; z: number };
//   to: { x: number; y: number; z: number };
//   latency: number;
//   color: string;
// }


import { CLOUD_REGIONS } from './cloudRegions';
import { EXCHANGE_SERVERS, GeoLocation } from './exchange';

export const calculateMockLatency = (loc1: GeoLocation, loc2: GeoLocation) => {
  const distance = haversineDistance(loc1, loc2);
  return Math.max(10, distance * 0.02 + 5 + (Math.random() * 20 - 10));
};

const haversineDistance = (loc1: GeoLocation, loc2: GeoLocation) => {
  const R = 6371; // Earth radius in km
  const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
  const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.latitude * Math.PI / 180) * 
    Math.cos(loc2.latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

export const generateMockLatency = (): Record<string, number> => {
  const result: Record<string, number> = {};
  
  EXCHANGE_SERVERS.forEach((exchange) => {
    CLOUD_REGIONS.forEach((region) => {
      const key = `${exchange.id}-${region.id}`;
      result[key] = calculateMockLatency(exchange.location, region.coverage[0]);
    });
  });

  return result;
};

export const generateMockHistoricalData = () => {
  const now = Date.now();
  const data: Record<string, Array<{ timestamp: number; latency: number }>> = {};

  EXCHANGE_SERVERS.forEach((exchange) => {
    CLOUD_REGIONS.forEach((region) => {
      const key = `${exchange.id}-${region.id}`;
      data[key] = [];

      for (let i = 0; i < 2016; i++) {
        data[key].push({
          timestamp: now - (2016 - i) * 300000, // 5-minute intervals
          latency: calculateMockLatency(exchange.location, region.coverage[0])
        });
      }
    });
  });

  return data;
};

export const getLatencyColor = (latency: number) => {
  if (latency < 50) return '#10B981'; // green
  if (latency < 100) return '#F59E0B'; // yellow
  return '#EF4444'; // red
};