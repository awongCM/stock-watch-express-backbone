# Stock Watch

Historical stock data visualization app with Express backend + Next.js frontend.

## Architecture

### Backend (Express API)

- **Framework:** Express.js
- **Database:** MongoDB via Mongoose
- **Data Source:** Quandl API (freemium tier)
- **Port:** 8080

**API Endpoints:**

- `GET /` - Informational JSON response
- `GET /api/available-stocks/` - List of available stock symbols
- `GET /api/stocks/` - Stock data with query params:
  - `stock_id` - Stock symbol (e.g., AAPL)
  - `download_type` - Format: `json` or `csv`
  - `is_table` - Return transformed table data
  - `is_graph` - Flag for graph display
  - `order_by` - Sort: `asc` or `desc`
  - `collapse_by` - Aggregation: `none`, `daily`, `weekly`, `monthly`, `quarterly`, `annual`
  - `start_date` / `end_date` - Date range filter (YYYY-MM-DD)

### Frontend (Next.js)

- **Location:** `next-app/`
- **Framework:** Next.js 14 + React 18 + TypeScript
- **Styling:** Bulma CSS Framework
- **Data Fetching:** TanStack Query (React Query)
- **Visualization:** Recharts for graphs
- **Port:** 3000 (dev mode)

## Migration History

This project originally used **Backbone.js** for the frontend. As of November 2025, it has been migrated to **Next.js** with the legacy frontend archived.

**What Changed:**

- ✅ Backbone views/models/collections → React components + hooks
- ✅ Pug templates → React JSX
- ✅ jQuery form handling → React state management
- ✅ D3v4 graphs → Recharts (with D3 fallback option)
- ✅ Gulp build pipeline → Next.js built-in bundler
- ✅ Static asset serving removed from Express
- ✅ Backend tests added (Jest + Supertest)

**Archived Assets:**

- All legacy Backbone code, Sass, Pug templates, and Gulp config moved to `archive/backbone/`
- See `ARCHIVE.md` for detailed migration notes and rollback instructions

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or remote)
- Quandl API key (configured in `quandlAPIServer.js`)

### Installation

```bash
# Install backend dependencies
npm install

# Install Next.js frontend dependencies
cd next-app
npm install
```

### Configuration

Edit `_config.yml` to configure:

- Available stock symbols
- MongoDB connection URI and database name

### Running the App

**Backend API:**

```bash
npm start
# Server runs on http://localhost:8080
```

**Next.js Frontend:**

```bash
cd next-app
npm run dev
# App runs on http://localhost:3000
```

**Backend Tests:**

```bash
npm run test:backend
```

**Frontend Tests:**

```bash
cd next-app
npm test
```

## Project Structure

```
.
├── server.js                 # Express API server
├── quandlAPIServer.js        # Quandl API proxy
├── config.js                 # YAML config loader
├── _config.yml               # App configuration
├── models/                   # Mongoose schemas
├── tests/                    # Backend API tests
├── archive/                  # Legacy Backbone assets
│   └── backbone/
└── next-app/                 # Next.js frontend
    ├── src/
    │   ├── components/       # React components
    │   ├── hooks/            # Custom React hooks
    │   ├── context/          # React context providers
    │   ├── lib/              # Utilities & API clients
    │   └── pages/            # Next.js routes
    └── public/               # Static assets
```

## Development Notes

### Adding New Stock Symbols

Edit `_config.yml` and add to the `STOCKS` array:

```yaml
STOCKS:
  - { NEWSYMBOL: "Company Name" }
```

### Extending API Endpoints

Add routes in `server.js` following the existing `/api/*` pattern.

### Frontend Component Updates

Navigate to `next-app/src/components/` and edit the relevant React component.

## TODO Items

1. ~~To decide whether to replace Backbone views with ReactJS~~ ✅ Migrated to Next.js
2. ~~Additional frontend logic to implement such as search queries params~~ ✅ Complete
3. ~~Include some useful graph features such as D3 or Chart JS~~ ✅ Recharts integrated
4. Implement CRUD operations for stock portfolio management (future enhancement)

## Contributing

See `ARCHIVE.md` for migration history and rollback procedures.
