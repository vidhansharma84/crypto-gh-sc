"use client";

import { useEffect } from "react";
import { TopNavbar } from "./TopNavbar";
import { AssetSidebar } from "../sidebar/AssetSidebar";
import { ChartPanel } from "../chart/ChartPanel";
import { OrderPanel } from "../order/OrderPanel";
import { BottomPanel } from "../positions/BottomPanel";
import { useTradingStore } from "@/store/trading-store";
import { usePriceSimulation } from "@/hooks/usePriceSimulation";
import { forexInstruments } from "@/data/instruments/forex";

export function TradingLayout() {
  const { selectedInstrument, setSelectedInstrument } = useTradingStore();

  usePriceSimulation();

  useEffect(() => {
    if (!selectedInstrument && forexInstruments.length > 0) {
      setSelectedInstrument(forexInstruments[0]);
    }
  }, [selectedInstrument, setSelectedInstrument]);

  return (
    <div className="h-screen w-screen overflow-hidden grid grid-rows-[64px_1fr_240px] grid-cols-[280px_1fr_320px] bg-bg-primary">
      <TopNavbar />
      <AssetSidebar />
      <ChartPanel />
      <OrderPanel />
      <BottomPanel />
    </div>
  );
}
