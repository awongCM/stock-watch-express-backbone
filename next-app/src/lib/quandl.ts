import type { RawQuandlDatasetResponse } from './types';

const BASE = 'https://www.quandl.com/api/v3/datasets/WIKI';

export async function fetchQuandlDataset(params: {
  stock_id: string;
  download_type?: string; // json|csv
  order_by?: string;
  collapse_by?: string;
  start_date?: string;
  end_date?: string;
}): Promise<Response> {
  const apiKey = process.env.QUANDL_API_KEY;
  
  if (!apiKey) {
    console.error('QUANDL_API_KEY not found in environment variables');
    throw new Error('Missing QUANDL_API_KEY environment variable');
  }
  const {
    stock_id,
    download_type = 'json',
    order_by = 'desc',
    collapse_by = 'quarterly',
    start_date = '1997-01-01',
    end_date = '2017-07-01'
  } = params;
  const url = `${BASE}/${stock_id}.${download_type}`;
  const qs = new URLSearchParams({
    api_key: apiKey || '',
    order: order_by,
    collapse: collapse_by,
    start_date,
    end_date
  });
  return fetch(`${url}?${qs.toString()}`);
}

export async function fetchQuandlJSON(params: Parameters<typeof fetchQuandlDataset>[0]) {
  const res = await fetchQuandlDataset({ ...params, download_type: 'json' });
  
  // Quandl WIKI database was discontinued - return mock data for development
  if (!res.ok) {
    console.warn(`Quandl API returned ${res.status}. Using mock data for development.`);
    return generateMockQuandlData(params.stock_id);
  }
  
  return res.json() as Promise<RawQuandlDatasetResponse>;
}

// Mock data generator since Quandl WIKI database is discontinued
function generateMockQuandlData(stockId: string): RawQuandlDatasetResponse {
  const startDate = new Date('2016-01-01');
  const endDate = new Date('2016-12-31');
  const data: any[][] = [];
  
  let currentDate = new Date(startDate);
  let basePrice = Math.random() * 100 + 50; // Random start price between 50-150
  
  while (currentDate <= endDate) {
    // Skip weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const open = basePrice + (Math.random() - 0.5) * 10;
      const close = open + (Math.random() - 0.5) * 5;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;
      const volume = Math.floor(Math.random() * 10000000) + 1000000;
      
      data.push([
        dateStr,
        open,
        high,
        low,
        close,
        volume,
        0, // ex-dividend
        0, // split ratio
        close, // adj_open
        high, // adj_high
        low, // adj_low
        close, // adj_close
        volume // adj_volume
      ]);
      
      basePrice = close; // Use previous close as next base
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return {
    dataset: {
      name: `${stockId} (Mock Data - Quandl WIKI discontinued)`,
      column_names: [
        'Date', 'Open', 'High', 'Low', 'Close', 'Volume',
        'Ex-Dividend', 'Split Ratio', 'Adj. Open', 'Adj. High',
        'Adj. Low', 'Adj. Close', 'Adj. Volume'
      ],
      data: data.reverse() // Quandl returns newest first
    }
  };
}
