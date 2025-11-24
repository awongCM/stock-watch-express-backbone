import { useQuery } from '@tanstack/react-query';
import { StocksParams } from '../context/StocksParamsContext';

export function useStocks(params: StocksParams) {
  return useQuery({
    queryKey: ['stocks', params],
    queryFn: async () => {
      const qs = new URLSearchParams({
        stock_id: params.stock_id,
        is_table: String(params.is_table),
        ...(params.order_by ? { order_by: params.order_by } : {}),
        ...(params.collapse_by ? { collapse_by: params.collapse_by } : {}),
        ...(params.start_date ? { start_date: params.start_date } : {}),
        ...(params.end_date ? { end_date: params.end_date } : {})
      }).toString();
      const res = await fetch(`/api/stocks?${qs}`);
      if (!res.ok) throw new Error('Failed to fetch stocks');
      return res.json();
    }
  });
}
