'use strict';

const yamlLoader = require('js-yaml'),
      fs = require('fs');

let config = {};

// 1. Attempt to load YAML (legacy path). Optional now.
try {
  if (fs.existsSync('_config.yml')) {
    config = yamlLoader.safeLoad(fs.readFileSync('_config.yml', 'utf8')) || {};
  }
} catch (error) {
  console.log('YAML config load failed (continuing with env):', error);
}

// 2. Parse STOCKS from environment if provided (overrides YAML).
// Format: AAPL:Apple,FB:Facebook
if (process.env.STOCKS) {
  const pairs = process.env.STOCKS.split(',').filter(Boolean);
  // Legacy shape expected by dropdown: array of single-key objects
  const legacyStocksArr = pairs.map(pair => {
    const [symbol, label] = pair.split(':');
    return { [symbol]: label };
  });
  config.STOCKS = legacyStocksArr;
}

// 3. Database settings precedence: MONGODB_URI -> DATABASE_URL -> YAML
const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL || (config.DATABASE_ENV && config.DATABASE_ENV.URI) || 'mongodb://localhost:27017/stock-watch';
const mongoDb = process.env.MONGODB_DB || (config.DATABASE_ENV && config.DATABASE_ENV.DB) || 'stock-watch';
const mongoCollection = process.env.MONGODB_COLLECTION || (config.DATABASE_ENV && config.DATABASE_ENV.COLLECTION) || 'collection';

config.DATABASE_ENV = {
  URI: mongoUri,
  DB: mongoDb,
  COLLECTION: mongoCollection
};

// 4. Emit merged config once for visibility.
try {
  console.log('[CONFIG] Loaded settings ->');
  console.log(JSON.stringify({
    STOCKS_COUNT: Array.isArray(config.STOCKS) ? config.STOCKS.length : 0,
    DATABASE_ENV: config.DATABASE_ENV
  }, null, 2));
} catch (e) {
  // ignore formatting errors
}

module.exports = config;