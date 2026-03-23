"use client";

import { useTradingStore } from "@/store/trading-store";
import { LoginPage } from "@/components/auth/LoginPage";
import { TradingLayout } from "@/components/layout/TradingLayout";

export default function AdminPage() {
  const { isAuthenticated } = useTradingStore();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <TradingLayout />;
}
