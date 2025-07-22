import { CLOUD_REGIONS } from './cloudRegions';
import { EXCHANGE_SERVERS } from './exchange';

// Mock historical data generator
export const generateHistoricalData = () => {
  const now = Date.now();
  const data: Record<string, Array<{ timestamp: number; latency: number }>> = {};

  EXCHANGE_SERVERS.forEach((exchange) => {
    CLOUD_REGIONS.forEach((region) => {
      const key = `${exchange.id}-${region.id}`;
      data[key] = [];

      // Generate 7 days of data points (every 5 minutes)
      for (let i = 0; i < 2016; i++) { // 7 days * 288 samples/day
        const baseLatency = Math.hypot(
          exchange.location.latitude - region.coverage[0].latitude,
          exchange.location.longitude - region.coverage[0].longitude
        ) * 5;
        
        data[key].push({
          timestamp: now - (2016 - i) * 300000, // 5-minute intervals
          latency: Math.max(20, baseLatency + (Math.random() * 30 - 15)),
        });
      }
    });
  });

  return data;
};

export const HISTORICAL_DATA = generateHistoricalData();