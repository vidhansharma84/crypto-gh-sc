import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import pool from "@/lib/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

interface PendingOrderRow extends RowDataPacket {
  id: string;
  user_id: string;
  instrument_id: string;
  symbol: string;
  side: "buy" | "sell";
  type: "limit" | "stop";
  target_price: number;
  quantity: number;
  leverage: number;
  stop_loss: number | null;
  take_profit: number | null;
  created_at: Date;
  expires_at: Date | null;
}

function rowToOrder(row: PendingOrderRow) {
  return {
    id: row.id,
    instrumentId: row.instrument_id,
    symbol: row.symbol,
    side: row.side,
    type: row.type,
    targetPrice: Number(row.target_price),
    quantity: Number(row.quantity),
    leverage: row.leverage,
    stopLoss: row.stop_loss ? Number(row.stop_loss) : null,
    takeProfit: row.take_profit ? Number(row.take_profit) : null,
    createdAt: row.created_at.toISOString(),
    expiresAt: row.expires_at ? row.expires_at.toISOString() : null,
  };
}

// GET - fetch user's pending orders
export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [rows] = await pool.query<PendingOrderRow[]>(
    "SELECT * FROM pending_orders WHERE user_id = ? ORDER BY created_at DESC",
    [user.id]
  );

  return NextResponse.json({ orders: rows.map(rowToOrder) });
}

// POST - create a pending order
export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    id, instrumentId, symbol, side, type, targetPrice,
    quantity, leverage, stopLoss, takeProfit, expiresAt,
  } = body;

  await pool.query<ResultSetHeader>(
    `INSERT INTO pending_orders
     (id, user_id, instrument_id, symbol, side, type, target_price,
      quantity, leverage, stop_loss, take_profit, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, user.id, instrumentId, symbol, side, type, targetPrice,
     quantity, leverage, stopLoss, takeProfit, expiresAt]
  );

  return NextResponse.json({ success: true });
}

// DELETE - cancel a pending order
export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await req.json();

  await pool.query<ResultSetHeader>(
    "DELETE FROM pending_orders WHERE id = ? AND user_id = ?",
    [orderId, user.id]
  );

  return NextResponse.json({ success: true });
}
