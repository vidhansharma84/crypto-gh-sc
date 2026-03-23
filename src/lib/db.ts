import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface DbUser {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  role: "user" | "admin";
  balance: number;
  createdAt: string;
}

const DB_PATH = path.join(process.cwd(), "data", "users.json");

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

function ensureDb(): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    // Seed with admin user
    const admin: DbUser = {
      id: crypto.randomUUID(),
      name: "Admin",
      email: "admin@fnxtrading.com",
      password: hashPassword("admin123"),
      role: "admin",
      balance: 0,
      createdAt: new Date().toISOString(),
    };
    fs.writeFileSync(DB_PATH, JSON.stringify([admin], null, 2));
  }
}

export function getUsers(): DbUser[] {
  ensureDb();
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}

function saveUsers(users: DbUser[]): void {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

export function getUserByEmail(email: string): DbUser | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): DbUser | undefined {
  return getUsers().find((u) => u.id === id);
}

export function createUser(name: string, email: string, password: string): DbUser {
  const users = getUsers();

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Email already registered");
  }

  const user: DbUser = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    password: hashPassword(password),
    role: "user",
    balance: 0,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);
  return user;
}

export function addFundsToUser(userId: string, amount: number): DbUser {
  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  user.balance += amount;
  saveUsers(users);
  return user;
}
