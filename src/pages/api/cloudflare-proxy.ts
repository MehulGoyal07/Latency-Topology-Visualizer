import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const cloudflareResponse = await fetch('https://api.cloudflare.com/client/v4/radar/http/timeseries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    if (!cloudflareResponse.ok) {
      const errorData = await cloudflareResponse.json();
      return res.status(cloudflareResponse.status).json(errorData);
    }

    const data = await cloudflareResponse.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Cloudflare proxy error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}