"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="FNX Trading" className="h-20 w-auto" />
        </div>

        {/* Register Card */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h1 className="text-lg font-bold text-text-primary text-center mb-1">
            Create Account
          </h1>
          <p className="text-xs text-text-tertiary text-center mb-6">
            Register to start trading
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-10 px-3 text-sm bg-bg-tertiary border border-border-primary rounded text-text-primary placeholder:text-text-tertiary/50 focus:outline-none focus:border-trading-blue"
              />
            </div>

            <div>
              <label className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
                placeholder="Min 6 characters"
                className="w-full h-10 px-3 text-sm bg-bg-tertiary border border-border-primary rounded text-text-primary placeholder:text-text-tertiary/50 focus:outline-none focus:border-trading-blue"
              />
            </div>

            {error && (
              <p className="text-xs text-trading-red text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-sm text-white bg-trading-blue hover:bg-trading-blue/90 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-xs text-text-tertiary text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-trading-blue hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
