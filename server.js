"use strict";

// Express Proxy Server
const express = require("express"),
  bodyParser = require("body-parser"),
  quandlAPIServer = require("./quandlAPIServer"),
  mongoose = require("mongoose"),
  StockModel = require("./models/stock"), //TODO - migrate to Next.js lib/db.ts
  config_settings = require("./config");

global.TextEncoder = require("util").TextEncoder;

const app = express();

// Front-end (Backbone) assets have been archived into /archive/backbone.
// Static serving and Pug view engine removed. Backend now exposes only API endpoints.

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mongoose connection only initialized when running the server directly to avoid open handles in tests.
function initMongoose() {
  const dbURI = config_settings.DATABASE_ENV.URI;
  mongoose
    .connect(dbURI, { dbName: config_settings.DATABASE_ENV.DB })
    .then(() => {
      console.log(`[Mongoose] Connected to ${dbURI}`);
    })
    .catch((err) => {
      console.error(`[Mongoose] Connection failed: ${err}`);
    });

  mongoose.connection.on("error", (err) => {
    console.log(`Mongoose default connection error: ${err}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("[Mongoose] Connection disconnected");
  });

  process.on("SIGINT", async () => {
    console.log("[Mongoose] Closing connection on app termination...");
    await mongoose.connection.close();
    process.exit(0);
  });
}

// Root informational endpoint after Backbone archival
app.get("/", (req, res) => {
  res.json({
    message: "Stock Watch API backend active. Front-end migrated to Next.js (see next-app).",
    archive: "/archive/backbone",
    endpoints: ["/api/available-stocks/", "/api/stocks/?stock_id=..."],
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

// Only start server if run directly (not when imported for tests)
if (require.main === module) {
  initMongoose();
  app.listen(8080, () => {
    console.log("Stock Watch API is running on port: 8080");
  });
}

module.exports = app;
