export interface CloudRegion {
  id: string;
  provider: 'aws' | 'gcp' | 'azure';
  name: string;
  regionCode: string;
  coverage: Array<{
    latitude: number;
    longitude: number;
    radius: number; // in km
  }>;
}

export const CLOUD_REGIONS: CloudRegion[] = [
  {
    id: 'aws-us-east-1',
    provider: 'aws',
    name: 'AWS US East (N. Virginia)',
    regionCode: 'us-east-1',
    coverage: [
      { latitude: 39.0438, longitude: -77.4874, radius: 500 },
      { latitude: 36.6681, longitude: -78.3889, radius: 300 },
    ],
  },
  {
    id: 'aws-eu-west-1',
    provider: 'aws',
    name: 'AWS EU (Ireland)',
    regionCode: 'eu-west-1',
    coverage: [
      { latitude: 53.3498, longitude: -6.2603, radius: 600 },
    ],
  },
  {
    id: 'gcp-us-central1',
    provider: 'gcp',
    name: 'GCP Iowa (us-central1)',
    regionCode: 'us-central1',
    coverage: [
      { latitude: 41.878, longitude: -93.0977, radius: 450 },
    ],
  },
  {
    id: 'gcp-asia-east1',
    provider: 'gcp',
    name: 'GCP Taiwan (asia-east1)',
    regionCode: 'asia-east1',
    coverage: [
      { latitude: 23.6978, longitude: 120.9605, radius: 400 },
    ],
  },
  {
    id: 'azure-eastus',
    provider: 'azure',
    name: 'Azure East US',
    regionCode: 'eastus',
    coverage: [
      { latitude: 37.7749, longitude: -78.6337, radius: 550 },
    ],
  },
  {
    id: 'azure-westeurope',
    provider: 'azure',
    name: 'Azure West Europe',
    regionCode: 'westeurope',
    coverage: [
      { latitude: 52.3667, longitude: 4.8945, radius: 500 },
    ],
  },
];