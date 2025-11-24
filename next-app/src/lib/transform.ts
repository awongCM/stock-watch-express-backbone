import { RawQuandlDatasetResponse, StockRow, TransformedGraphDatum } from './types';

export function mapRawToRows(raw: RawQuandlDatasetResponse): StockRow[] {
  return raw.dataset.data.map(item => ({
    date: item[0] as string,
    open: item[1] as number,
    high: item[2] as number,
    low: item[3] as number,
    close: item[4] as number,
    volume: item[5] as number,
    ex_dvd: item[6] as number,
    split_ratio: item[7] as number,
    adj_open: item[8] as number,
    adj_high: item[9] as number,
    adj_low: item[10] as number,
    adj_close: item[11] as number,
    adj_vol: item[12] as number
  }));
}

export function toGraphData(rows: StockRow[]): TransformedGraphDatum[] {
  return rows.map(r => ({ date: r.date, open: r.open, close: r.close }));
}
