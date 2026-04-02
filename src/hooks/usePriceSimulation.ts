"use client";

import { useEffect, useRef } from "react";
import { useTradingStore } from "@/store/trading-store";

export function usePriceSimulation() {
  const selectedInstrument = useTradingStore((s) => s.selectedInstrument);
  const setSelectedInstrument = useTradingStore((s) => s.setSelectedInstrument);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    if (!selectedInstrument) return;

    intervalRef.current = setInterval(() => {
      const instrument = useTradingStore.getState().selectedInstrument;
      if (!instrument) return;

      const volatility = instrument.pipSize * (Math.random() * 5);
      const direction = Math.random() > 0.5 ? 1 : -1;
      const newBid = instrument.bid + direction * volatility;
      const spread = instrument.ask - instrument.bid;

      setSelectedInstrument({
        ...instrument,
        bid: parseFloat(newBid.toFixed(6)),
        ask: parseFloat((newBid + spread).toFixed(6)),
        change: parseFloat((direction * volatility).toFixed(6)),
        changePercent: parseFloat(
          (((direction * volatility) / instrument.bid) * 100).toFixed(2)
        ),
      });

      // Update open position prices with new market data
      useTradingStore.getState().updatePositionPrices();
    }, 1500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedInstrument?.id, setSelectedInstrument]);
}
