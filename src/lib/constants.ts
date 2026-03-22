import type { Timeframe, ChartType } from "@/types/chart";
import type { AssetCategory } from "@/types/instrument";

export const TIMEFRAMES: { label: string; value: Timeframe }[] = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "1H", value: "1h" },
  { label: "4H", value: "4h" },
  { label: "1D", value: "1D" },
  { label: "1W", value: "1W" },
];

export const CHART_TYPES: { label: string; value: ChartType }[] = [
  { label: "Candlestick", value: "candlestick" },
  { label: "Line", value: "line" },
  { label: "Bar", value: "bar" },
];

export const ASSET_CATEGORIES: {
  id: AssetCategory;
  name: string;
  icon: string;
}[] = [
  { id: "forex", name: "Forex", icon: "DollarSign" },
  { id: "crypto", name: "Crypto", icon: "Bitcoin" },
  { id: "stocks", name: "Stocks", icon: "TrendingUp" },
  { id: "commodities", name: "Commodities", icon: "Gem" },
  { id: "indices", name: "Indices", icon: "BarChart3" },
  { id: "etfs", name: "ETFs", icon: "PieChart" },
];

export const LEVERAGE_OPTIONS = [1, 5, 10, 25, 50, 100, 200, 400];
