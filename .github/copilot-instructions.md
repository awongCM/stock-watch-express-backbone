# Stock Watch Express Backbone - AI Coding Instructions

## Architecture Overview

This is a full-stack stock data visualization app using **Backbone.js frontend + Express backend + MongoDB**. The app fetches historical stock data from Quandl API and displays it as tables/graphs.

**Data Flow:**

1. User selects stock & date range in Backbone form view (`scripts/views/stocksFormView.js`)
2. Form submits to `/api/stocks/` endpoint (`server.js`)
3. Backend proxies request to Quandl API (`quandlAPIServer.js`)
4. Response flows back to Backbone collection (`scripts/collections/stocksCollections.js`)
5. Collection triggers table view (`stocksTableView.js`) and/or D3 graph view (`stocksGraphView.js`)

## Key Patterns & Conventions

### Configuration via YAML

- All config lives in `_config.yml` (stocks list, MongoDB settings)
- Loaded at startup via `config.js` using `js-yaml`
- Access via `config_settings.STOCKS` or `config_settings.DATABASE_ENV`

### Dual Database Libraries

- **Mongoose**: Used for schema definition (`models/stock.js`) and connection lifecycle
- **Mongonaut + MongoClient**: Used for actual DB operations (legacy pattern)
- Both connect to same MongoDB URI from config

### Backbone View Lifecycle

- Views instantiated globally in `scripts/app.js` IIFE
- Global `stockApp` namespace holds all app components
- Collections use `listenTo(collection, 'sync', ...)` for reactive updates
- Two display modes controlled by flags: `show_table` and `show_graph`

### API Response Handling

- Backend returns different formats based on `is_table` param:
  - Table mode: JSON with `{title, column_names, stocks}` structure
  - Download mode: Sets `Content-Disposition` header for CSV/JSON file download
- Collection's `parse()` method transforms raw API response for both table and D3 consumption

### D3 Graph Implementation

- Uses D3v4 time scales and line generators
- SVG created once, paths appended per render (`stocksGraphView.js`)
- Data mapped from Quandl's array format `[date, open, high, low, close, ...]` to D3-friendly objects in `parseD3JSON()`
- Dual lines: close price (default color) and open price (red)

## Development Workflow

### Running Locally

```bash
npm start              # Start Express server on port 8080
npm run gulpify        # Build Sass, copy scripts to public/, run with live reload on port 7070
```

### Docker Development

```bash
docker-compose up      # Starts web + MongoDB containers
```

- Web service mounts current directory with `node_modules` exclusion
- MongoDB accessible at `mongodb://db/stock-watch` (internal Docker network)

### Build Pipeline (Gulp)

- `gulp scripts` → copies `scripts/**/*.js` to `public/scripts`
- `gulp sass` → compiles `sass/main.sass` to `public/stylesheets`
- BrowserSync proxies Express and watches `public/**/*` for live reload

## Critical Implementation Details

### Quandl API Integration

- Hardcoded API key in `quandlAPIServer.js` (freemium tier)
- Supports `order`, `collapse`, `start_date`, `end_date` query params
- URI pattern: `https://www.quandl.com/api/v3/datasets/WIKI/{stock_id}.{format}`

### Date Handling

- Frontend assembles dates from 3 dropdowns (day/month/year) into `YYYY-MM-DD` format
- Date utility (`dateUtility.js`) generates dropdown options for view rendering

### View Cleanup Pattern

- Table view empties with `$("#table-container").empty()` when `show_table` is false
- Graph view similar cleanup in `emptyGraphContent()` (see `stocksGraphView.js:100+`)

## Common Pitfalls

- **Don't use ES6 modules**: This project uses script concatenation, not bundlers. Use IIFE + global namespace pattern
- **Bulma for styling**: CSS framework already loaded via Bower, reference its classes directly
- **Pug (not Jade)**: Template engine in `views/index.pug` renders initial page with date dropdowns
- **MongoDB schema unused**: `models/stock.js` defines schema but CRUD not implemented (see README TODO #4)
