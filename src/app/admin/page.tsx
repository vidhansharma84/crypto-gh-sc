"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, DollarSign, Users, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  balance: number;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<UserRow | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fundUserId, setFundUserId] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [fundLoading, setFundLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [meRes, usersRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/admin/users"),
      ]);

      if (!meRes.ok) {
        router.push("/login");
        return;
      }

      const meData = await meRes.json();
      if (meData.user.role !== "admin") {
        router.push("/");
        return;
      }

      setAdminUser(meData.user);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users);
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleAddFunds = async (userId: string) => {
    const amount = parseFloat(fundAmount);
    if (!amount || amount <= 0) return;

    setFundLoading(true);
    try {
      const res = await fetch("/api/admin/add-funds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount }),
      });

      if (res.ok) {
        setFundUserId(null);
        setFundAmount("");
        fetchData();
      }
    } catch {
      // silently fail
    } finally {
      setFundLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-tertiary text-sm">Loading...</div>
      </div>
    );
  }

  if (!adminUser) return null;

  const regularUsers = users.filter((u) => u.role === "user");

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border-primary px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="FNX Trading" className="h-10 w-auto" />
          <div>
            <h1 className="text-sm font-bold text-text-primary">Admin Dashboard</h1>
            <p className="text-[10px] text-text-tertiary">{adminUser.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded text-xs text-text-secondary hover:bg-trading-red/20 hover:text-trading-red transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-trading-blue" />
              <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Total Users</span>
            </div>
            <span className="text-lg font-bold text-text-primary">{regularUsers.length}</span>
          </div>
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-trading-green" />
              <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Total Funds</span>
            </div>
            <span className="text-lg font-bold text-text-primary">
              {formatCurrency(regularUsers.reduce((sum, u) => sum + u.balance, 0))}
            </span>
          </div>
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-4 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4 text-text-tertiary cursor-pointer hover:text-trading-blue transition-colors" onClick={fetchData} />
              <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Refresh Data</span>
            </div>
            <button onClick={fetchData} className="text-xs text-trading-blue hover:underline">
              Click to refresh
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border-primary">
            <h2 className="text-sm font-bold text-text-primary">Registered Users</h2>
          </div>

          {regularUsers.length === 0 ? (
            <div className="p-8 text-center text-sm text-text-tertiary">
              No users registered yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border-primary bg-bg-tertiary">
                    <th className="text-left px-4 py-2 text-text-tertiary font-medium uppercase tracking-wider text-[10px]">Name</th>
                    <th className="text-left px-4 py-2 text-text-tertiary font-medium uppercase tracking-wider text-[10px]">Email</th>
                    <th className="text-right px-4 py-2 text-text-tertiary font-medium uppercase tracking-wider text-[10px]">Balance</th>
                    <th className="text-left px-4 py-2 text-text-tertiary font-medium uppercase tracking-wider text-[10px]">Joined</th>
                    <th className="text-center px-4 py-2 text-text-tertiary font-medium uppercase tracking-wider text-[10px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {regularUsers.map((u) => (
                    <tr key={u.id} className="border-b border-border-primary/50 hover:bg-bg-hover transition-colors">
                      <td className="px-4 py-3 text-text-primary font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                      <td className="px-4 py-3 text-right font-mono text-trading-green">{formatCurrency(u.balance)}</td>
                      <td className="px-4 py-3 text-text-tertiary">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {fundUserId === u.id ? (
                          <div className="flex items-center gap-1 justify-center">
                            <input
                              type="number"
                              value={fundAmount}
                              onChange={(e) => setFundAmount(e.target.value)}
                              placeholder="Amount"
                              className="w-24 h-7 px-2 text-xs bg-bg-tertiary border border-border-primary rounded text-text-primary focus:outline-none focus:border-trading-blue"
                              min="0"
                              step="100"
                              autoFocus
                            />
                            <button
                              onClick={() => handleAddFunds(u.id)}
                              disabled={fundLoading}
                              className="px-2 py-1 text-[10px] bg-trading-green text-white rounded hover:bg-trading-green/90 disabled:opacity-50"
                            >
                              {fundLoading ? "..." : "Add"}
                            </button>
                            <button
                              onClick={() => { setFundUserId(null); setFundAmount(""); }}
                              className="px-2 py-1 text-[10px] bg-bg-tertiary text-text-secondary rounded hover:bg-bg-hover"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setFundUserId(u.id)}
                            className="px-3 py-1 text-[10px] bg-trading-blue/20 text-trading-blue rounded hover:bg-trading-blue/30 transition-colors"
                          >
                            + Add Funds
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
