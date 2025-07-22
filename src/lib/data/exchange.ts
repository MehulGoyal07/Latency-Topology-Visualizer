// export interface ExchangeServer {
//   id: string;
//   name: string;
//   location: {
//     city: string;
//     country: string;
//     latitude: number;
//     longitude: number;
//   };
//   cloudProvider: 'aws' | 'gcp' | 'azure';
//   latency?: number;
// }

// export const EXCHANGE_SERVERS: ExchangeServer[] = [
//   {
//     id: 'binance-1',
//     name: 'Binance',
//     location: {
//       city: 'Tokyo',
//       country: 'Japan',
//       latitude: 35.6762,
//       longitude: 139.6503,
//     },
//     cloudProvider: 'aws',
//   },
//   {
//     id: 'bybit-1',
//     name: 'Bybit',
//     location: {
//       city: 'Singapore',
//       country: 'Singapore',
//       latitude: 1.3521,
//       longitude: 103.8198,
//     },
//     cloudProvider: 'aws',
//   },
//   {
//     id: 'okx-1',
//     name: 'OKX',
//     location: {
//       city: 'Hong Kong',
//       country: 'China',
//       latitude: 22.3193,
//       longitude: 114.1694,
//     },
//     cloudProvider: 'gcp',
//   },
//   {
//     id: 'deribit-1',
//     name: 'Deribit',
//     location: {
//       city: 'Amsterdam',
//       country: 'Netherlands',
//       latitude: 52.3676,
//       longitude: 4.9041,
//     },
//     cloudProvider: 'azure',
//   },
//   {
//     id: 'kraken-1',
//     name: 'Kraken',
//     location: {
//       city: 'San Francisco',
//       country: 'USA',
//       latitude: 37.7749,
//       longitude: -122.4194,
//     },
//     cloudProvider: 'aws',
//   },
//   {
//     id: 'coinbase-1',
//     name: 'Coinbase',
//     location: {
//       city: 'New York',
//       country: 'USA',
//       latitude: 40.7128,
//       longitude: -74.006,
//     },
//     cloudProvider: 'gcp',
//   },
//   {
//     id: 'bitmex-1',
//     name: 'BitMEX',
//     location: {
//       city: 'Seychelles',
//       country: 'Seychelles',
//       latitude: -4.6796,
//       longitude: 55.492,
//     },
//     cloudProvider: 'azure',
//   },
//   {
//     id: 'ftx-1',
//     name: 'FTX',
//     location: {
//       city: 'Bahamas',
//       country: 'Bahamas',
//       latitude: 25.0343,
//       longitude: -77.3963,
//     },
//     cloudProvider: 'aws',
//   },
// ];
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