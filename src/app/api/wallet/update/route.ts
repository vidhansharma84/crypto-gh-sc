import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { addFundsToUser } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount } = await req.json();
  if (typeof amount !== "number") {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  try {
    const updated = await addFundsToUser(user.id, amount);
    return NextResponse.json({ balance: updated.balance });
  } catch {
    return NextResponse.json({ error: "Failed to update wallet" }, { status: 500 });
  }
}
