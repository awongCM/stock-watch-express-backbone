'use strict';

const request = require('request');

// API key now sourced from environment variable (security best practice)
const QUANDL_API_KEY = process.env.QUANDL_API_KEY || '_6uS2usoj9fz6kBLWbiw'; // fallback for dev only

let qsOpts = {
    api_key: QUANDL_API_KEY,
    order: 'desc',
    collapse: 'quarterly',
    start_date: '1997-01-01',
    end_date: '2017-07-01'
}

//Timeseries API
let quandlAPIServerCallTS = {
  default: {
    // Nasdaq Data Link (formerly Quandl) datasets API base.
    // Provide the database code via environment or default to EOD (End-of-Day pricing).
    base: `https://data.nasdaq.com/api/v3/datasets/${process.env.NASDAQ_DATABASE_CODE || 'EOD'}`,
    uri: "",
    qs: qsOpts
  }
  
}

exports.fetchDataSetByQuery = function(params, callback) {

  const {stock_id, download_type, order_by, collapse_by, start_date, end_date} = params;
  
  // datasets/{database_code}/{dataset_code}.{format}
  // Here, stock_id is treated as the dataset_code (e.g., 'AAPL').
  // If you use a different database, set NASDAQ_DATABASE_CODE env var.
  quandlAPIServerCallTS.default.uri = `${quandlAPIServerCallTS.default.base}/${stock_id}.${download_type}`;
  quandlAPIServerCallTS.default.qs.order = order_by;
  quandlAPIServerCallTS.default.qs.collapse = collapse_by;
  quandlAPIServerCallTS.default.qs.start_date = start_date;
  quandlAPIServerCallTS.default.qs.end_date = end_date;
  
  request.get(quandlAPIServerCallTS.default, (err, response, body) => {
    if(err) {
        callback(err, null, null);
    }
    else if(response !== null) {
        callback(null, response, body);
    }
  });

  
}

