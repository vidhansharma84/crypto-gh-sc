import { NextResponse } from "next/server";
import { getUserByEmail, verifyPassword } from "@/lib/db";
import { setSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await setSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: user.balance,
      },
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
