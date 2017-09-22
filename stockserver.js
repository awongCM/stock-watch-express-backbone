'use strict';

// Express Server
const express = require('express'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      errorHandler = require('error-handler'),
      https = require('https'),
      path = require('path'),
      pug = require('pug'),
      quandlAPIServer = require('./quandlAPIServer'),
      moment = require('moment'),
      mongoose = require('mongoose'),
      MongoClient = require('mongodb').MongoClient,
      Mongonaut = require('mongonaut');

const dbURI = 'mongodb://localhost/stock-watch';
const mongoStock = new Mongonaut({'db': 'stock-watch','collection': 'stocks'});
let db;

const app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '/public')));

app.use('/bower_components', express.static(path.join(__dirname , '/bower_components')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// router.get('/', function(req,res){
//
//   quandlAPIServer.retrieveDataSet(function(error, data){
//     if(error){
//         console.log(error);
//         res.send(error);
//     }
//     else{
//         console.log('Found data');
//         //res.json(JSON.parse(data));
//         res.render('index');
//     }
//   });
// });
//

//Mongoose Events
mongoose.connect(dbURI);

let csvimporturl = './apple-stock.csv';

// When successfully connected
mongoose.connection.on('connected', () => {
  console.log(`Mongoose default connection open to ${dbURI}`);
  //import csv here
  mongoStock.import(csvimporturl).then((response) => {
    console.log('csv import successful!', response);
  }).catch((err) => {
    console.log('Something went wrong with our import process here', err);
  });

});

// If the connection throws an error
mongoose.connection.on('error', err => {
  console.log(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  console.log('ended');

  mongoose.connection.db.dropDatabase(() => {console.log("db dropped")});
  mongoose.connection.db.close();

  process.exit(0);
});

//MongooseClient
MongoClient.connect(dbURI, (err, database) => {
  if (err) { return console.log(err);}
  db = database;
})

//Fetching from Mongoose side

// app.get('/', function (req, res, next) {
//   db.collection('stocks').find().toArray(function (err, result) {
//     if (err) { return console.log(err);}
//     res.render('index', {title: 'Today\'s stocks for Apple ', stocks: result});
//   });

// });

//OR json endpoint
app.get('/', (req, res, next) => {
  quandlAPIServer.retrieveDataSet((error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log(body);
      let res_data = JSON.parse(body);
      res.render('index', {title: res_data.dataset.name, column_names: res_data.dataset.column_names, stocks: res_data.dataset.data });
     } else {
      res.render('index', {title: "No data is available at this time", column_names: null, stocks: null });
     }
  })
})

app.get('/api/stocks/', (req, res, next) => {
  let params = {
      stock_id: req.query.stock_id,
      download_type: req.query.download_type,
      is_table: req.query.is_table
  };

  quandlAPIServer.fetchDataSetByQuery(params, (err, response, body)=> {
      if (!err && response.statusCode === 200) {
        console.log("body: ", body);

        if (typeof body ==='object') {
          let response_data = JSON.parse(body);
          // res.render('index', {title: res_data.dataset.name, column_names: res_data.dataset.column_names, stocks: res_data.dataset.data });
          // console.log(response_data.quandl_error);
          res.json(response_data);
        
        }
        else {
          res.setHeader('Content-disposition', 'attachment; filename=testing.csv');
          res.set('Content-Type', 'text/csv');
          res.status(200).send(body);
        }

          
      } else {
        // res.render('index', {title: "No data is available at this time", column_names: null, stocks: null });
        res.json({message: "Couldn't process data from BE at this time"});
      }
  });

});

app.listen(8080);
console.log('Stock Watch API is running on port: 8080');
