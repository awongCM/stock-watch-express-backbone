# Testing Guide

## Test Setup

Jest + React Testing Library configured for Next.js components and utility functions.

### Run Tests

```bash
cd next-app
npm test              # Run all tests once
npm run test:watch    # Watch mode for development
```

## Test Coverage

### Unit Tests

- **Transform Functions** (`lib/__tests__/transform.test.ts`):

  - `mapRawToRows`: Validates raw Quandl array → StockRow transformation
  - `toGraphData`: Ensures correct date/open/close extraction for charts

- **Config Utilities** (`lib/__tests__/config.test.ts`):
  - `getStocksList`: Parses STOCKS env variable into structured array

### Component Tests

- **StockTable** (`components/__tests__/StockTable.test.tsx`):

  - Loading state rendering
  - Empty data handling
  - Table structure with mock data

- **StockGraph** (`components/__tests__/StockGraph.test.tsx`):
  - No data state
  - Chart rendering (Recharts mocked)
  - Toggle controls for open/close lines

## Testing Conventions

1. **File Location**: Place tests in `__tests__` folders adjacent to source.
2. **Naming**: `*.test.ts` for utils, `*.test.tsx` for components.
3. **Mocking**: External libs (Recharts, fetch) mocked to isolate logic.
4. **Coverage Target**: Aim for 80%+ on critical paths (transforms, API routes).

## Future Test Additions

- **API Route Tests**: Mock Quandl responses, validate `/api/stocks` output shape.
- **Integration Tests**: Full form submission → table render flow.
- **Contract Regression**: Snapshot tests for API response structures.
- **E2E (Optional)**: Playwright for critical user journeys post-cutover.

## CI Integration

Add to GitHub Actions:

```yaml
- run: cd next-app && npm test
```

## Debugging

```bash
npm test -- --verbose
npm test -- --coverage  # Generate coverage report
```
