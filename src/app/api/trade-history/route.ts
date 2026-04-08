import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import pool from "@/lib/mysql";
import type { RowDataPacket } from "mysql2";

interface TradeHistoryRow extends RowDataPacket {
  id: string;
  user_id: string;
  instrument_id: string;
  symbol: string;
  side: "buy" | "sell";
  type: "market" | "limit" | "stop";
  open_price: number;
  close_price: number;
  quantity: number;
  leverage: number;
  stop_loss: number | null;
  take_profit: number | null;
  profit_loss: number;
  profit_loss_percent: number;
  margin: number;
  swap: number;
  commission: number;
  open_time: Date;
  close_time: Date;
  duration: string;
  status: "closed";
}

// GET - fetch user's trade history
export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [rows] = await pool.query<TradeHistoryRow[]>(
    "SELECT * FROM trade_history WHERE user_id = ? ORDER BY close_time DESC LIMIT 100",
    [user.id]
  );

  const history = rows.map((row) => ({
    id: row.id,
    instrumentId: row.instrument_id,
    symbol: row.symbol,
    side: row.side,
    type: row.type,
    openPrice: Number(row.open_price),
    currentPrice: Number(row.close_price),
    closePrice: Number(row.close_price),
    quantity: Number(row.quantity),
    leverage: row.leverage,
    stopLoss: row.stop_loss ? Number(row.stop_loss) : null,
    takeProfit: row.take_profit ? Number(row.take_profit) : null,
    profitLoss: Number(row.profit_loss),
    profitLossPercent: Number(row.profit_loss_percent),
    margin: Number(row.margin),
    swap: Number(row.swap),
    commission: Number(row.commission),
    openTime: row.open_time.toISOString(),
    closeTime: row.close_time.toISOString(),
    duration: row.duration,
    status: row.status,
  }));

  return NextResponse.json({ history });
}
