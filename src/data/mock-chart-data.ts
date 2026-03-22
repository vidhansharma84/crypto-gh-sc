import type { CandlestickData } from "@/types/chart";

export function generateCandlestickData(
  basePrice: number,
  count: number,
  volatility: number = 0.02
): CandlestickData[] {
  const data: CandlestickData[] = [];
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = count; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const change = (Math.random() - 0.48) * volatility * currentPrice;
    const open = currentPrice;
    const close = open + change;
    const high =
      Math.max(open, close) + Math.random() * volatility * currentPrice * 0.5;
    const low =
      Math.min(open, close) - Math.random() * volatility * currentPrice * 0.5;

    data.push({
      time: date.toISOString().split("T")[0],
      open: parseFloat(open.toFixed(5)),
      high: parseFloat(high.toFixed(5)),
      low: parseFloat(low.toFixed(5)),
      close: parseFloat(close.toFixed(5)),
    });

    currentPrice = close;
  }
  return data;
}

export function getChartDataForInstrument(
  instrumentId: string,
  basePrice: number
): CandlestickData[] {
  const volatilityMap: Record<string, number> = {
    forex: 0.005,
    crypto: 0.03,
    stocks: 0.02,
    commodities: 0.015,
    indices: 0.01,
    etfs: 0.012,
  };

  const categoryFromId = (id: string): string => {
    const cryptoIds = [
      "btcusd", "ethusd", "solusd", "xrpusd", "adausd", "dotusd",
      "avaxusd", "linkusd", "maticusd", "dogeusd",
    ];
    const forexIds = [
      "eurusd", "gbpusd", "usdjpy", "usdchf", "audusd", "nzdusd",
    ];
    if (cryptoIds.some((c) => id.includes(c.replace("/", "").toLowerCase())))
      return "crypto";
    if (forexIds.some((f) => id.includes(f))) return "forex";
    return "stocks";
  };

  const category = categoryFromId(instrumentId);
  const volatility = volatilityMap[category] || 0.02;

  return generateCandlestickData(basePrice, 500, volatility);
}
