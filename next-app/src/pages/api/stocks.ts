import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchQuandlJSON } from '../../lib/quandl';
import { mapRawToRows } from '../../lib/transform';
import { checkRateLimit } from '../../lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Rate limiting: 20 requests per minute per IP
  const identifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const limit = checkRateLimit(String(identifier), { windowMs: 60000, maxRequests: 20 });
  
  res.setHeader('X-RateLimit-Limit', '20');
  res.setHeader('X-RateLimit-Remaining', String(limit.remaining));
  res.setHeader('X-RateLimit-Reset', String(Math.floor(limit.resetAt / 1000)));

  if (!limit.allowed) {
    return res.status(429).json({ message: 'Rate limit exceeded. Try again later.' });
  }

  try {
    const { stock_id = 'AAPL', is_table = 'true', order_by, collapse_by, start_date, end_date } = req.query;

    const raw = await fetchQuandlJSON({
      stock_id: stock_id as string,
      order_by: order_by as string | undefined,
      collapse_by: collapse_by as string | undefined,
      start_date: start_date as string | undefined,
      end_date: end_date as string | undefined
    });

    if (is_table === 'true') {
      const { dataset } = raw;
      res.status(200).json({ title: dataset.name, column_names: dataset.column_names, stocks: dataset.data });
    } else {
      // Pass through raw json (mirrors legacy download when forced json)
      res.status(200).json(raw);
    }
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Unexpected error' });
  }
}
