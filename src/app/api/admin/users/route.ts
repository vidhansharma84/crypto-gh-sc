import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUsers } from "@/lib/db";

export async function GET() {
  const user = await getSession();

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = getUsers().map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    balance: u.balance,
    createdAt: u.createdAt,
  }));

  return NextResponse.json({ users });
}
