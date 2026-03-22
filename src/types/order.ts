export type OrderSide = "buy" | "sell";
export type OrderType = "market" | "limit" | "stop";
export type PositionStatus = "open" | "closed" | "pending";

export interface Position {
  id: string;
  instrumentId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  openPrice: number;
  currentPrice: number;
  quantity: number;
  leverage: number;
  stopLoss: number | null;
  takeProfit: number | null;
  profitLoss: number;
  profitLossPercent: number;
  margin: number;
  swap: number;
  commission: number;
  openTime: string;
  status: PositionStatus;
}

export interface TradeHistoryEntry extends Position {
  closePrice: number;
  closeTime: string;
  duration: string;
}

export interface PendingOrder {
  id: string;
  instrumentId: string;
  symbol: string;
  side: OrderSide;
  type: "limit" | "stop";
  targetPrice: number;
  quantity: number;
  leverage: number;
  stopLoss: number | null;
  takeProfit: number | null;
  createdAt: string;
  expiresAt: string | null;
}

export interface OrderFormState {
  side: OrderSide;
  type: OrderType;
  amount: number;
  leverage: number;
  stopLoss: number | null;
  takeProfit: number | null;
  limitPrice: number | null;
  stopLossEnabled: boolean;
  takeProfitEnabled: boolean;
}
