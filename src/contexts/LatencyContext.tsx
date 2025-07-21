import { fetchLatencyData } from '@/lib/data/latency';
import { createContext, useContext, useEffect, useState } from 'react';

interface LatencyContextType {
  latencies: Record<string, number>;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const LatencyContext = createContext<LatencyContextType>({
  latencies: {},
  loading: false,
  error: null,
  refresh: () => {},
});

export const LatencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [latencies, setLatencies] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchLatencyData();
      setLatencies(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch latency data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <LatencyContext.Provider
      value={{ latencies, loading, error, refresh: fetchData }}
    >
      {children}
    </LatencyContext.Provider>
  );
};

export const useLatency = () => useContext(LatencyContext);