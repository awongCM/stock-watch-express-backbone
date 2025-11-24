"use strict";

// Express Proxy Server
const express = require("express"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  errorHandler = require("error-handler"),
  https = require("https"),
  path = require("path"),
  pug = require("pug"),
  quandlAPIServer = require("./quandlAPIServer"),
  dateUtility = require("./dateUtility"),
  mongoose = require("mongoose"),
  StockModel = require("./models/stock"), //TODO - migrate to Next.js lib/db.ts
  config_settings = require("./config");

global.TextEncoder = require("util").TextEncoder;

const app = express();

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "/public")));

app.use(
  "/bower_components",
  express.static(path.join(__dirname, "/bower_components"))
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Mongoose configuration (consolidated - Mongonaut/MongoClient removed)
const dbURI = config_settings.DATABASE_ENV.URI;

mongoose.connect(dbURI, {
  dbName: config_settings.DATABASE_ENV.DB
}).then(() => {
  console.log(`[Mongoose] Connected to ${dbURI}`);
}).catch((err) => {
  console.error(`[Mongoose] Connection failed: ${err}`);
});

// If the connection throws an error
mongoose.connection.on("error", (err) => {
  console.log(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  console.log("[Mongoose] Connection disconnected");
});

// If the Node process ends, close the Mongoose connection gracefully
process.on("SIGINT", async () => {
  console.log("[Mongoose] Closing connection on app termination...");
  await mongoose.connection.close();
  process.exit(0);
});

// rendering home page
app.get("/", (req, res, next) => {
  res.render("index", {
    years: dateUtility.getCalendarYears(),
    months: dateUtility.getShortCalendarMonths(),
    days: dateUtility.getCalendarDays(),
  });
});

// TODO - need to come up with a bettter api end point for dropdowns
app.get("/api/available-stocks/", (req, res, next) => {
  res.json({ available_stocks: config_settings.STOCKS });
});

app.get("/api/stocks/", (req, res, next) => {
  let params = {
    stock_id: req.query.stock_id,
    download_type: req.query.download_type,
    is_table: req.query.is_table,
    order_by: req.query.order_by,
    collapse_by: req.query.collapse_by,
    start_date: req.query.start_date,
    end_date: req.query.end_date,
  };

  console.log("Incoming params...", params);

  quandlAPIServer.fetchDataSetByQuery(params, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      let response_data,
        is_valid_json,
        attachment_prefix,
        download_type_suffix,
        display_as_table;

      download_type_suffix = params.download_type;
      display_as_table = params.is_table;

      //try catch error for parsing JSON
      try {
        response_data = JSON.parse(body);
        is_valid_json = true;
      } catch (error) {
        // TODO - assuming for now it is valid csv format
        response_data = body;
        is_valid_json = false;
        attachment_prefix = params.stock_id;
      }

      if (is_valid_json && display_as_table) {
        const { name, column_names, data } = response_data.dataset;
        res.json({ title: name, column_names: column_names, stocks: data });
      } else {
        //handling raw file types from server
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" +
            attachment_prefix +
            "." +
            download_type_suffix
        );

        if (download_type_suffix === "json") {
          res.set("Content-Type", "application/json");
          res.status(200).send(JSON.stringify(response_data));
        } else {
          res.set("Content-Type", "text/csv");
          res.status(200).send(response_data);
        }
      }
    } else {
      res.json({
        message: "Couldn't process data from BE at this time" + response,
      });
    }
  });
});

app.listen(8080);
console.log("Stock Watch API is running on port: 8080");
