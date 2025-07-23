export type CloudProvider = 'aws' | 'gcp' | 'azure';

export interface GeoLocation {
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

export interface ExchangeServer {
  id: string;
  name: string;
  location: GeoLocation;
  cloudProvider: CloudProvider;
  asn?: string; // For Cloudflare API
  latency?: number; // Add this line (optional)
}

export const EXCHANGE_SERVERS: ExchangeServer[] = [
  {
    id: 'binance-1',
    name: 'Binance',
    location: {
      city: 'Tokyo',
      country: 'Japan',
      countryCode: 'JP',
      latitude: 35.6762,
      longitude: 139.6503,
    },
    cloudProvider: 'aws',
    asn: '13335' // Cloudflare ASN for Binance
  },
  {
    id: 'bybit-1',
    name: 'Bybit',
    location: {
      city: 'Singapore',
      country: 'Singapore',
      countryCode: 'SG',
      latitude: 1.3521,
      longitude: 103.8198,
    },
    cloudProvider: 'aws',
    asn: '132892'
  },
  // Add other exchanges with their ASNs...
] as const;