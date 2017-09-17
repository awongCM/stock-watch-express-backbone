//TODO to create proper third API server request

'use strict';
// Express Server
var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('error-handler'),
    https = require('https'),
    path = require('path'),
    request = require('request'),
    quandlAPIServer = require('./quandlAPIServer'),
    moment = require('moment');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;

app.get('/', function(req,res, next){

  quandlAPIServer.retrieveDataSet(function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body);
      res.json(JSON.parse(body));
       
     } else {
       res.json(error);
     }
  })

});

app.listen(port);
console.log('Stock Rest API is running on port: 8081');
