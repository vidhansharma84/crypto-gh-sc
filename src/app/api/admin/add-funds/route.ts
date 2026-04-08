import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { addFundsToUser } from "@/lib/db";

export async function POST(req: NextRequest) {
  const admin = await getSession();

  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, amount } = body;

  if (!userId || typeof amount !== "number" || amount <= 0) {
    return NextResponse.json(
      { error: "Valid userId and positive amount required" },
      { status: 400 }
    );
  }

  try {
    const user = await addFundsToUser(userId, amount);
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
