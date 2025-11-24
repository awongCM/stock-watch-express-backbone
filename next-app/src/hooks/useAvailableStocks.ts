import { useQuery } from '@tanstack/react-query';

export function useAvailableStocks() {
  return useQuery({
    queryKey: ['available-stocks'],
    queryFn: async () => {
      const res = await fetch('/api/available-stocks');
      if (!res.ok) throw new Error('Failed to fetch list');
      return res.json();
    }
  });
}
