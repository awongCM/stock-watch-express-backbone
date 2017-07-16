'use strict';

const request = require('request');

let quandlAPIServerCall = {
	uri: "https://www.quandl.com/api/v3/datasets/WIKI/GOOGL/data.json",
	qs: {
		api_key: '_6uS2usoj9fz6kBLWbiw'
	}
}

exports.retrieveDataSet = function(callback) {
  request.get(quandlAPIServerCall, function(err, response, body){
  	if(err) {
        callback(err, null, null);
    }
    else if(response.body !== null) {
      	callback(null, response, body);
    }
  });
}
