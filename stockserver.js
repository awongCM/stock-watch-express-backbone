'use strict';

// Express Server
var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('error-handler'),
    https = require('https'),
    path = require('path'),
    ejs = require('ejs'), //TODO
    quandlAPIServer = require('./quandlAPIServer'),
    moment = require('moment'),
    sassMiddleWare = require('node-sass-middleware'),
    mongoose = require('mongoose'),
    MongoClient = require('mongodb').MongoClient,
    Mongonaut = require('mongonaut');

var dbURI = 'mongodb://localhost/stock-watch',
    mongoStock = new Mongonaut({'db': 'stock-watch','collection': 'stocks'}),
    db;

var app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(sassMiddleWare({
    src: path.join(__dirname, '/sass') ,
    dest: path.join(__dirname, '/public/stylesheets'),
    debug: false
  })
);

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
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
  //import csv here
  mongoStock.import(csvimporturl).then((response) => {
    console.log('csv import successful!', response);
  }).catch((err) => {
    console.log('Something went wrong with our import process here', err);
  });

});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  console.log('ended');

  mongoose.connection.db.dropDatabase(() => {console.log("db dropped")});
  mongoose.connection.db.close();

  process.exit(0);
});

//MongooseClient
MongoClient.connect(dbURI, function (err, database) {
  if (err) { return console.log(err);}
  db = database;
})

app.get('/', function (req, res, next) {
  db.collection('stocks').find().toArray(function (err, result) {
    if (err) { return console.log(err);}
    res.render('index', {title: 'Today\'s stocks for Apple ', stocks: result});
  });

});

app.listen(8080);
console.log('Stock Watch API is running on port: 8080');
