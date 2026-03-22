export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1D" | "1W";
export type ChartType = "candlestick" | "line" | "bar";

export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface LineData {
  time: string;
  value: number;
}
