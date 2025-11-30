# Backbone Front-End Archival

The original Backbone.js + Bulma front-end has been archived as part of the migration to a Next.js implementation located in `next-app/`.

## Archived Contents

All legacy front-end assets were moved into `archive/backbone/`:

- `scripts/` (Backbone views, models, collections, utilities)
- `sass/` (Bulma-based custom Sass + extensions)
- `views/index.pug` (Original Pug layout and Underscore templates)
- `bower.json` (Legacy front-end dependency manifest)
- `public_scripts/` (Compiled/copy of runtime Backbone scripts)
- `public_stylesheets/` (Compiled Bulma + custom CSS)

## Server Changes

`server.js` was updated to:

- Remove Pug view engine configuration
- Remove static serving of `public/` and `bower_components/`
- Replace `/` route with a JSON informational endpoint

The Express backend now exclusively serves API endpoints:

- `GET /api/available-stocks/`
- `GET /api/stocks/?stock_id=...&download_type=...`

## Data & Utilities

Backend utilities retained:

- `dateUtility.js` (calendar helpers – currently unused after archival)
- `quandlAPIServer.js` (Quandl proxy logic)
- `config.js` / `_config.yml` (stock list + database settings)

## Next.js Front-End

The new React/Next.js front-end lives in `next-app/` and consumes the same API endpoints.

## Rollback / Reference

To inspect or restore any legacy behavior, refer to the archived files. They were not modified—only relocated.

## Suggested Cleanup (Optional)

- Remove unused dependencies (`pug`, `error-handler`, `method-override`) if no longer needed.
- Remove `dateUtility.js` if not reused in Next.js or backend.
- Add tests around `/api/stocks/` formatting edge cases.

## Gulp Decommissioned

The legacy build pipeline (Gulp tasks for Sass compilation, script copying, BrowserSync) has been archived. Rationale:

- Next.js provides built-in dev server, HMR, asset bundling.
- Sass and Bulma are consumed directly in `next-app`.
- No remaining transformation step is required for Express API.

Changes applied:

- `gulpfile.js` moved to `archive/backbone/gulpfile.js`.
- Removed `gulp`, `gulp-sass`, `gulp-nodemon`, `browser-sync`, `del` devDependencies.
- Removed `gulpify` script from `package.json`.

Rollback (if ever needed): restore `gulpfile.js` to root, re-add dependencies, and recreate `gulpify` script.

---

Migration timestamp: 2025-11-30
