export const PROVIDER_NAMES = {
  aws: 'AWS',
  gcp: 'Google Cloud',
  azure: 'Microsoft Azure'
} as const;

export const PROVIDER_COLORS = {
  aws: '#FF9900',
  gcp: '#4285F4',
  azure: '#008AD7'
} as const;

export const TIME_RANGES = ['1h', '24h', '7d'] as const;
export type TimeRange = typeof TIME_RANGES[number];