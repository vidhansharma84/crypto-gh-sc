import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import pool from "@/lib/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

interface PositionRow extends RowDataPacket {
  id: string;
  user_id: string;
  instrument_id: string;
  symbol: string;
  side: "buy" | "sell";
  type: "market" | "limit" | "stop";
  open_price: number;
  current_price: number;
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
  status: "open" | "closed" | "pending";
}

function rowToPosition(row: PositionRow) {
  return {
    id: row.id,
    instrumentId: row.instrument_id,
    symbol: row.symbol,
    side: row.side,
    type: row.type,
    openPrice: Number(row.open_price),
    currentPrice: Number(row.current_price),
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
    status: row.status,
  };
}

// GET - fetch user's open positions
export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [rows] = await pool.query<PositionRow[]>(
    "SELECT * FROM positions WHERE user_id = ? AND status = 'open' ORDER BY open_time DESC",
    [user.id]
  );

  return NextResponse.json({ positions: rows.map(rowToPosition) });
}

// POST - create a new position
export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    id, instrumentId, symbol, side, type, openPrice, currentPrice,
    quantity, leverage, stopLoss, takeProfit, margin, swap, commission,
  } = body;

  await pool.query<ResultSetHeader>(
    `INSERT INTO positions
     (id, user_id, instrument_id, symbol, side, type, open_price, current_price,
      quantity, leverage, stop_loss, take_profit, margin, swap, commission, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')`,
    [id, user.id, instrumentId, symbol, side, type, openPrice, currentPrice,
     quantity, leverage, stopLoss, takeProfit, margin, swap, commission]
  );

  return NextResponse.json({ success: true });
}

// DELETE - close a position (move to trade_history)
export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { positionId, closePrice, closeTime, duration, profitLoss, profitLossPercent } = await req.json();

  const [rows] = await pool.query<PositionRow[]>(
    "SELECT * FROM positions WHERE id = ? AND user_id = ?",
    [positionId, user.id]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "Position not found" }, { status: 404 });
  }

  const pos = rows[0];

  // Insert into trade_history
  await pool.query<ResultSetHeader>(
    `INSERT INTO trade_history
     (id, user_id, instrument_id, symbol, side, type, open_price, close_price,
      quantity, leverage, stop_loss, take_profit, profit_loss, profit_loss_percent,
      margin, swap, commission, open_time, close_time, duration, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'closed')`,
    [pos.id, pos.user_id, pos.instrument_id, pos.symbol, pos.side, pos.type,
     pos.open_price, closePrice, pos.quantity, pos.leverage, pos.stop_loss,
     pos.take_profit, profitLoss, profitLossPercent, pos.margin, pos.swap,
     pos.commission, pos.open_time, closeTime, duration]
  );

  // Delete from positions
  await pool.query<ResultSetHeader>(
    "DELETE FROM positions WHERE id = ? AND user_id = ?",
    [positionId, user.id]
  );

  return NextResponse.json({ success: true });
}
