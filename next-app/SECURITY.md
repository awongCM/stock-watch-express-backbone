# Security Improvements

## API Key Management

### Legacy Express (`quandlAPIServer.js`)

- Quandl API key moved from hardcoded value to `process.env.QUANDL_API_KEY`
- Fallback retained for local dev; remove in production deployment

### Next.js (`lib/quandl.ts`)

- API key accessed via `process.env.QUANDL_API_KEY` (server-side only)
- Never exposed to client via `NEXT_PUBLIC_*` prefix

### Environment Setup

Add to `.env` (never commit):

```bash
QUANDL_API_KEY=your_actual_key_here
```

## Rate Limiting

### Implementation

- Custom in-memory sliding window rate limiter (`lib/rateLimit.ts`)
- Tracks requests per IP address using `x-forwarded-for` or socket remote address
- Cleans up expired entries automatically when store exceeds 10k entries

### API Endpoint Limits

- `/api/stocks`: 20 requests/minute per IP
- `/api/available-stocks`: 30 requests/minute per IP

### Response Headers

- `X-RateLimit-Limit`: Maximum requests allowed per window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

### 429 Response

```json
{
  "message": "Rate limit exceeded. Try again later."
}
```

## Production Considerations

### Rate Limiting Upgrades

- Replace in-memory store with Redis for multi-instance deployments
- Consider `express-rate-limit` or `@upstash/ratelimit` packages
- Add per-user limits (after authentication) instead of just IP-based

### API Key Rotation

- Implement key rotation strategy (monthly/quarterly)
- Monitor Quandl usage limits via dashboard
- Add circuit breaker if Quandl API fails repeatedly

### Input Validation

- Add schema validation (zod) for query params
- Sanitize `stock_id` (allow only alphanumeric + known symbols)
- Validate date formats strictly (`YYYY-MM-DD`)

### CORS & CSRF

- Restrict CORS origins in production
- Add CSRF tokens for mutation operations (if adding CRUD)

### Logging & Monitoring

- Log rate limit violations with IP + timestamp
- Alert on sustained 429 responses (potential DoS)
- Track Quandl API errors for quota monitoring

## Testing Rate Limits

```bash
# Test rate limit trigger
for i in {1..25}; do curl http://localhost:3000/api/stocks?stock_id=AAPL; done
# Expect 429 after 20 requests
```
