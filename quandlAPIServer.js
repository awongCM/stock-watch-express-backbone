'use strict';

const request = require('request');

let qsOpts = {
    api_key: '_6uS2usoj9fz6kBLWbiw',
    order: 'desc',
    collapse: 'quarterly',
    start_date: '1997-01-01',
    end_date: '2017-07-01'
}

//Timeseries API
let quandlAPIServerCallTS = {
  default: {
    base: "https://www.quandl.com/api/v3/datasets/WIKI/",
    uri: "",
    qs: qsOpts
  }
  
}

exports.fetchDataSetByQuery = function(params, callback) {

  const {stock_id, download_type, order_by, collapse_by, start_date, end_date} = params;
  
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

