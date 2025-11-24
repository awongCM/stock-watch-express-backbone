# Performance & SEO Optimizations

## Server-Side Rendering (SSR)

### Homepage (`/`)

- **Strategy**: SSR with prefetched default stock data (AAPL)
- **Benefit**: Instant content visibility, improved First Contentful Paint (FCP)
- **Implementation**: `getServerSideProps` prefetches default query into React Query cache
- **SEO**: Full HTML rendered on server, crawlable by search engines

### Stock Detail Pages (`/stocks/[symbol]`)

- **Strategy**: ISR (Incremental Static Regeneration) with 1-hour revalidation
- **Benefit**: Static generation for popular stocks, on-demand for others
- **Revalidation**: Pages rebuild every hour with fresh data
- **Fallback**: `blocking` mode ensures new symbols generate without stale data

## SEO Metadata

### Meta Tags

- Dynamic title and description per page
- Viewport meta for mobile responsiveness
- Open Graph tags (future addition for social sharing)

### Structured Data (Future)

- JSON-LD schema for financial data
- Breadcrumbs for stock detail pages

## Performance Metrics

### Target Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s via SSR prefetch
- **FID (First Input Delay)**: < 100ms via code splitting
- **CLS (Cumulative Layout Shift)**: < 0.1 via skeleton loaders

### Bundle Optimizations

- Recharts lazy loaded (future: dynamic import)
- React Query cache persists across navigation
- Minimal JS bundle on initial load (Next.js automatic code splitting)

## Caching Strategy

### React Query

- **staleTime**: 5 minutes (reduces redundant fetches)
- **gcTime**: 30 minutes (keeps cache in memory)
- **prefetchQuery**: SSR hydration ensures instant display

### CDN (Production)

- Static assets cached via Vercel Edge Network
- API routes cached with `Cache-Control` headers (future)

## Image Optimization (Future)

- Use Next.js `<Image>` component for stock logos
- WebP format with fallbacks
- Lazy loading below fold

## Monitoring

### Tools

- Lighthouse CI for automated audits
- Next.js Analytics for real-world performance
- Sentry for error tracking

### Key Metrics to Track

- SSR response time (target < 500ms)
- ISR cache hit rate (target > 90%)
- API route p95 latency (target < 1s)

## Future Enhancements

### Service Worker

- Offline support for previously viewed stocks
- Background sync for stale data

### Prefetch on Hover

- Prefetch stock data when hovering dropdown options
- Instant navigation to stock detail pages

### Advanced Caching

- Redis for API response cache (reduce Quandl API calls)
- Edge caching for `/api/available-stocks` (static data)

### Progressive Enhancement

- Show skeleton loaders during data fetch
- Graceful degradation for JS-disabled users

## Build Analysis

```bash
npm run build
# Review bundle size and page generation times
```

### Expected Output

- Homepage: SSR (no static build)
- Stock pages: ISR with 6 pre-generated paths (AAPL, GOOGL, etc.)
- API routes: Serverless functions
