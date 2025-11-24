import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes for stock datasets
        gcTime: 1000 * 60 * 30, // keep cached for 30 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      }
    }
  });
}
