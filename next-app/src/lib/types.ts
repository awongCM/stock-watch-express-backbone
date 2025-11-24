export interface RawQuandlDatasetResponse {
  dataset: {
    name: string;
    column_names: string[];
    data: (number | string)[][];
  };
}

export interface StockRow {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ex_dvd: number;
  split_ratio: number;
  adj_open: number;
  adj_high: number;
  adj_low: number;
  adj_close: number;
  adj_vol: number;
}

export interface StocksTablePayload {
  title: string;
  column_names: string[];
  stocks: (number | string)[][];
}

export interface TransformedGraphDatum {
  date: string; // ISO before parsing
  open: number;
  close: number;
}

export interface StocksQueryParams {
  stock_id: string;
  download_type?: string; // json|csv
  order_by?: string; // asc|desc
  collapse_by?: string; // daily|weekly|monthly|quarterly
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  is_table?: string; // 'true' | 'false'
}
