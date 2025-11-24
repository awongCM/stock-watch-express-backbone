import type { NextApiRequest, NextApiResponse } from 'next';
import { getStocksList } from '../../lib/config';
import { checkRateLimit } from '../../lib/rateLimit';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Rate limiting: 30 requests per minute per IP (lighter endpoint)
  const identifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const limit = checkRateLimit(String(identifier), { windowMs: 60000, maxRequests: 30 });
  
  res.setHeader('X-RateLimit-Limit', '30');
  res.setHeader('X-RateLimit-Remaining', String(limit.remaining));
  res.setHeader('X-RateLimit-Reset', String(Math.floor(limit.resetAt / 1000)));

  if (!limit.allowed) {
    return res.status(429).json({ message: 'Rate limit exceeded. Try again later.' });
  }

  res.status(200).json({ available_stocks: getStocksList() });
}
