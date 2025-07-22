import { generateMockHistoricalData } from '@/lib/data/latency';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // In production, replace with actual API call
    const data = await fetchHistoricalFromDatabase(); 
    res.status(200).json(data);
  } catch (error) {
    console.error('Historical API error:', error);
    // Fallback to mock data
    res.status(200).json(generateMockHistoricalData());
  }
}

async function fetchHistoricalFromDatabase() {
  // Implement your actual database/API call here
  return generateMockHistoricalData();
}