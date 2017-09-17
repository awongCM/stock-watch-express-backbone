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
  json: {
    uri: "https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json",
    qs: qsOpts
  },
  //TODO:
  csv : {
    uri: "https://www.quandl.com/api/v3/datasets/WIKI/AAPL.csv",
    qs: qsOpts
  }
  
}

exports.retrieveDataSet = function(callback) {
  request.get(quandlAPIServerCallTS.json, function(err, response, body){
  	if(err) {
        callback(err, null, null);
    }
    else if(response.body !== null) {
      	callback(null, response, body);
    }
  });
}
