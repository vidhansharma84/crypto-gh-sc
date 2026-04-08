import crypto from "crypto";
import pool from "./mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export interface DbUser {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  role: "user" | "admin";
  balance: number;
  createdAt: string;
}

interface UserRow extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  balance: number;
  created_at: Date;
}

function rowToUser(row: UserRow): DbUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    role: row.role,
    balance: Number(row.balance),
    createdAt: row.created_at.toISOString(),
  };
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export async function getUsers(): Promise<DbUser[]> {
  const [rows] = await pool.query<UserRow[]>("SELECT * FROM users");
  return rows.map(rowToUser);
}

export async function getUserByEmail(email: string): Promise<DbUser | undefined> {
  const [rows] = await pool.query<UserRow[]>(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email.toLowerCase()]
  );
  return rows[0] ? rowToUser(rows[0]) : undefined;
}

export async function getUserById(id: string): Promise<DbUser | undefined> {
  const [rows] = await pool.query<UserRow[]>(
    "SELECT * FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] ? rowToUser(rows[0]) : undefined;
}

export async function createUser(name: string, email: string, password: string): Promise<DbUser> {
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error("Email already registered");
  }

  const id = crypto.randomUUID();
  const hashedPassword = hashPassword(password);

  await pool.query<ResultSetHeader>(
    "INSERT INTO users (id, name, email, password, role, balance) VALUES (?, ?, ?, ?, 'user', 0)",
    [id, name, email.toLowerCase(), hashedPassword]
  );

  const user = await getUserById(id);
  if (!user) throw new Error("Failed to create user");
  return user;
}

export async function addFundsToUser(userId: string, amount: number): Promise<DbUser> {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE users SET balance = balance + ? WHERE id = ?",
    [amount, userId]
  );
  if (result.affectedRows === 0) throw new Error("User not found");

  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");
  return user;
}
