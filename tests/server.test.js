const request = require('supertest');

// Mock quandlAPIServer before requiring server
jest.mock('../quandlAPIServer', () => ({
  fetchDataSetByQuery: (params, cb) => {
    const body = JSON.stringify({
      dataset: {
        name: 'Mock Dataset',
        column_names: ['Date', 'Open', 'Close'],
        data: [
          ['2024-01-01', 100, 110],
          ['2024-01-02', 105, 115]
        ]
      }
    });
    cb(null, { statusCode: 200 }, body);
  }
}));

const app = require('../server');

describe('Stock Watch Backend API', () => {
  test('GET / returns informational JSON', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('endpoints');
  });

  test('GET /api/available-stocks returns stocks array', async () => {
    const res = await request(app).get('/api/available-stocks/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('available_stocks');
    expect(Array.isArray(res.body.available_stocks)).toBe(true);
    expect(res.body.available_stocks.length).toBeGreaterThan(0);
  });

  test('GET /api/stocks table mode returns transformed dataset', async () => {
    const res = await request(app)
      .get('/api/stocks/')
      .query({
        stock_id: 'AAPL',
        download_type: 'json',
        is_table: 'true',
        order_by: 'asc',
        collapse_by: 'none'
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title', 'Mock Dataset');
    expect(res.body).toHaveProperty('column_names');
    expect(res.body).toHaveProperty('stocks');
    expect(Array.isArray(res.body.stocks)).toBe(true);
  });

  test('GET /api/stocks raw CSV download sets attachment header when JSON parse fails', async () => {
    // Re-mock quandlAPIServer to return CSV body
    jest.resetModules();
    jest.doMock('../quandlAPIServer', () => ({
      fetchDataSetByQuery: (params, cb) => {
        const csv = 'Date,Open,Close\n2024-01-01,100,110';
        cb(null, { statusCode: 200 }, csv); // invalid JSON => triggers catch block
      }
    }));
    const freshApp = require('../server');
    const res = await request(freshApp)
      .get('/api/stocks/')
      .query({
        stock_id: 'AAPL',
        download_type: 'csv',
        is_table: 'false',
        order_by: 'asc',
        collapse_by: 'none'
      });
    expect(res.status).toBe(200);
    expect(res.headers['content-disposition']).toMatch(/attachment; filename=.+\.csv/);
    expect(res.text).toContain('Date,Open,Close');
  });
});
