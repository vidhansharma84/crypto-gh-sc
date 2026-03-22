export type AssetCategory = "forex" | "crypto" | "stocks" | "commodities" | "indices" | "etfs";

export interface Instrument {
  id: string;
  symbol: string;
  displayName: string;
  category: AssetCategory;
  bid: number;
  ask: number;
  spread: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  pipSize: number;
  lotSize: number;
  currency: string;
  leverage: number[];
  isFavorite?: boolean;
}
