/* eslint-disable @typescript-eslint/no-explicit-any */
import { CLOUD_REGIONS } from '@/lib/data/cloudRegions';
import { EXCHANGE_SERVERS } from '@/lib/data/exchange';
import { calculateMockLatency, generateMockHistoricalData, generateMockLatency } from '@/lib/data/latency';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface LatencyData {
  realtime: Record<string, number>;
  historical: Record<string, Array<{ timestamp: number; latency: number }>>;
}

interface LatencyContextType {
  data: LatencyData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  exchanges: typeof EXCHANGE_SERVERS;
  regions: typeof CLOUD_REGIONS;
}

const LatencyContext = createContext<LatencyContextType | undefined>(undefined);

export const LatencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<LatencyData>({
    realtime: {},
    historical: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCloudflareLatency = useCallback(async () => {
    // Always fallback to mock data in development
    if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_CLOUDFLARE_API_KEY) {
      console.log('Using mock latency data');
      return generateMockLatency();
    }

    try {
      const response = await fetch('/api/cloudflare-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aggInterval: '5m',
          dateRange: '1d',
          location: EXCHANGE_SERVERS.map(ex => ex.location.countryCode),
          asn: EXCHANGE_SERVERS.filter(ex => ex.asn).map(ex => ex.asn),
          metrics: ['rttAvg']
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch latency data');
      }

      const result = await response.json();
      return processCloudflareData(result);
    } catch (err) {
      console.error('API Error:', err);
      return generateMockLatency(); // Fallback to mock data
    }
  }, []);

  const processCloudflareData = (apiData: any) => {
    const latencies: Record<string, number> = {};

    if (!apiData?.result?.timeseries) return generateMockLatency();

    apiData.result.timeseries.forEach((point: any) => {
      const exchange = EXCHANGE_SERVERS.find(e => e.asn === point.asn);
      if (!exchange) return;

      CLOUD_REGIONS.forEach(region => {
        const key = `${exchange.id}-${region.id}`;
        latencies[key] = point.rttAvg || calculateMockLatency(exchange.location, region.coverage[0]);
      });
    });

    return latencies;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [realtime, historical] = await Promise.all([
        fetchCloudflareLatency(),
        Promise.resolve(generateMockHistoricalData())
      ]);
      setData({ realtime, historical });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API Error');
      console.error('Fetch error:', err);
      setData({
        realtime: generateMockLatency(),
        historical: generateMockHistoricalData()
      });
    } finally {
      setLoading(false);
    }
  }, [fetchCloudflareLatency]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <LatencyContext.Provider
      value={{
        data,
        loading,
        error,
        refresh: fetchData,
        exchanges: EXCHANGE_SERVERS,
        regions: CLOUD_REGIONS
      }}
    >
      {children}
    </LatencyContext.Provider>
  );
};

export const useLatency = () => {
  const context = useContext(LatencyContext);
  if (!context) {
    throw new Error('useLatency must be used within LatencyProvider');
  }
  return context;
};