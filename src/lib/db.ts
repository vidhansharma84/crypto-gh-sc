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

const ADMIN_EMAIL = "admin@fnxtrading.com";
const ADMIN_PASSWORD = "admin123";

let schemaEnsured = false;
let adminEnsured = false;

// Auto-create all required tables if they don't exist (self-healing schema).
async function ensureSchema(): Promise<void> {
  if (schemaEnsured) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(64) NOT NULL,
      role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
      balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS positions (
      id VARCHAR(50) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      instrument_id VARCHAR(50) NOT NULL,
      symbol VARCHAR(20) NOT NULL,
      side ENUM('buy', 'sell') NOT NULL,
      type ENUM('market', 'limit', 'stop') NOT NULL,
      open_price DECIMAL(20, 8) NOT NULL,
      current_price DECIMAL(20, 8) NOT NULL,
      quantity DECIMAL(15, 4) NOT NULL,
      leverage INT NOT NULL,
      stop_loss DECIMAL(20, 8) DEFAULT NULL,
      take_profit DECIMAL(20, 8) DEFAULT NULL,
      profit_loss DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
      profit_loss_percent DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      margin DECIMAL(15, 2) NOT NULL,
      swap DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      commission DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      open_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status ENUM('open', 'closed', 'pending') NOT NULL DEFAULT 'open',
      INDEX idx_user_status (user_id, status),
      INDEX idx_instrument (instrument_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS trade_history (
      id VARCHAR(50) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      instrument_id VARCHAR(50) NOT NULL,
      symbol VARCHAR(20) NOT NULL,
      side ENUM('buy', 'sell') NOT NULL,
      type ENUM('market', 'limit', 'stop') NOT NULL,
      open_price DECIMAL(20, 8) NOT NULL,
      close_price DECIMAL(20, 8) NOT NULL,
      quantity DECIMAL(15, 4) NOT NULL,
      leverage INT NOT NULL,
      stop_loss DECIMAL(20, 8) DEFAULT NULL,
      take_profit DECIMAL(20, 8) DEFAULT NULL,
      profit_loss DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
      profit_loss_percent DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      margin DECIMAL(15, 2) NOT NULL,
      swap DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      commission DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      open_time TIMESTAMP NOT NULL,
      close_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      duration VARCHAR(50) NOT NULL DEFAULT '',
      status ENUM('open', 'closed', 'pending') NOT NULL DEFAULT 'closed',
      INDEX idx_user (user_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pending_orders (
      id VARCHAR(50) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      instrument_id VARCHAR(50) NOT NULL,
      symbol VARCHAR(20) NOT NULL,
      side ENUM('buy', 'sell') NOT NULL,
      type ENUM('limit', 'stop') NOT NULL,
      target_price DECIMAL(20, 8) NOT NULL,
      quantity DECIMAL(15, 4) NOT NULL,
      leverage INT NOT NULL,
      stop_loss DECIMAL(20, 8) DEFAULT NULL,
      take_profit DECIMAL(20, 8) DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NULL DEFAULT NULL,
      INDEX idx_user (user_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  schemaEnsured = true;
  console.log("✅ MySQL schema ensured");
}

// Auto-create admin user if it doesn't exist (self-healing).
// Runs once per container lifetime; safe on fresh DBs or if admin row is missing.
export async function ensureAdmin(): Promise<void> {
  if (adminEnsured) return;
  try {
    await ensureSchema();
    const [rows] = await pool.query<UserRow[]>(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [ADMIN_EMAIL]
    );
    if (rows.length === 0) {
      await pool.query<ResultSetHeader>(
        "INSERT INTO users (id, name, email, password, role, balance) VALUES (?, 'Admin', ?, ?, 'admin', 0)",
        [crypto.randomUUID(), ADMIN_EMAIL, hashPassword(ADMIN_PASSWORD)]
      );
      console.log("✅ Admin user auto-created");
    }
    adminEnsured = true;
  } catch (err) {
    console.error("ensureAdmin failed:", err);
  }
}

export async function getUsers(): Promise<DbUser[]> {
  await ensureAdmin();
  const [rows] = await pool.query<UserRow[]>("SELECT * FROM users");
  return rows.map(rowToUser);
}

export async function getUserByEmail(email: string): Promise<DbUser | undefined> {
  await ensureAdmin();
  const [rows] = await pool.query<UserRow[]>(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email.toLowerCase()]
  );
  return rows[0] ? rowToUser(rows[0]) : undefined;
}

export async function getUserById(id: string): Promise<DbUser | undefined> {
  await ensureAdmin();
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
