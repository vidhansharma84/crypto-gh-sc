"use client";

import { useTradingStore } from "@/store/trading-store";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { LoginPage } from "@/components/auth/LoginPage";

export default function Home() {
  const { isAuthenticated } = useTradingStore();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <TradingLayout />;
}
