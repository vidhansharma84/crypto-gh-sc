"use client";

import { useState } from "react";
import { useTradingStore } from "@/store/trading-store";

export function LoginPage() {
  const { login } = useTradingStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = login(email, password);
    if (!success) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="h-screen w-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="FNX Trading" className="h-20 w-auto" />
        </div>

        {/* Login Card */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h1 className="text-lg font-bold text-text-primary text-center mb-1">
            Admin Login
          </h1>
          <p className="text-xs text-text-tertiary text-center mb-6">
            Sign in to access the trading platform
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fnxtrading.com"
                className="w-full h-10 px-3 text-sm bg-bg-tertiary border border-border-primary rounded text-text-primary placeholder:text-text-tertiary/50 focus:outline-none focus:border-trading-blue"
              />
            </div>

            <div>
              <label className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full h-10 px-3 text-sm bg-bg-tertiary border border-border-primary rounded text-text-primary placeholder:text-text-tertiary/50 focus:outline-none focus:border-trading-blue"
              />
            </div>

            {error && (
              <p className="text-xs text-trading-red text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold text-sm text-white bg-trading-blue hover:bg-trading-blue/90 transition-all active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
