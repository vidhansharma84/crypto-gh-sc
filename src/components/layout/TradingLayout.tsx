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
  const { selectedInstrument, setSelectedInstrument, sidebarOpen, toggleSidebar, orderPanelOpen, toggleOrderPanel } = useTradingStore();

  usePriceSimulation();

  useEffect(() => {
    if (!selectedInstrument && forexInstruments.length > 0) {
      setSelectedInstrument(forexInstruments[0]);
    }
  }, [selectedInstrument, setSelectedInstrument]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-bg-primary">
      <TopNavbar />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar - hidden on mobile, shown on lg */}
        <div className="hidden lg:flex w-[280px] flex-shrink-0">
          <AssetSidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />
            <div className="fixed inset-y-0 left-0 w-[300px] z-50 lg:hidden">
              <AssetSidebar />
            </div>
          </>
        )}

        {/* Chart + Bottom panel area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 overflow-hidden">
            <ChartPanel />
          </div>
          <div className="h-[200px] lg:h-[240px] flex-shrink-0">
            <BottomPanel />
          </div>
        </div>

        {/* Order panel - hidden on mobile, shown on lg */}
        <div className="hidden lg:flex w-[320px] flex-shrink-0">
          <OrderPanel />
        </div>

        {/* Mobile order panel overlay */}
        {orderPanelOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleOrderPanel} />
            <div className="fixed inset-y-0 right-0 w-[320px] max-w-[85vw] z-50 lg:hidden">
              <OrderPanel />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
