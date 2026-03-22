"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  BarSeries,
  ColorType,
  type IChartApi,
} from "lightweight-charts";
import { useTradingStore } from "@/store/trading-store";
import { generateCandlestickData } from "@/data/mock-chart-data";

export function TradingChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const selectedInstrument = useTradingStore((s) => s.selectedInstrument);
  const chartType = useTradingStore((s) => s.chartType);
  const timeframe = useTradingStore((s) => s.timeframe);

  useEffect(() => {
    if (!chartContainerRef.current || !selectedInstrument) return;

    const container = chartContainerRef.current;

    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: "#0d1117" },
        textColor: "#8b949e",
        fontFamily: "var(--font-geist-mono), monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#1c233350" },
        horzLines: { color: "#1c233350" },
      },
      width: container.clientWidth,
      height: container.clientHeight,
      crosshair: {
        vertLine: { color: "#30363d", labelBackgroundColor: "#2979ff" },
        horzLine: { color: "#30363d", labelBackgroundColor: "#2979ff" },
      },
      timeScale: {
        borderColor: "#30363d",
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "#30363d",
      },
    });

    chartRef.current = chart;

    const basePrice = selectedInstrument.bid;
    const volatilityMap: Record<string, number> = {
      forex: 0.003,
      crypto: 0.025,
      stocks: 0.015,
      commodities: 0.01,
      indices: 0.008,
      etfs: 0.01,
    };
    const volatility = volatilityMap[selectedInstrument.category] || 0.015;
    const data = generateCandlestickData(basePrice, 500, volatility);

    if (chartType === "candlestick") {
      const series = chart.addSeries(CandlestickSeries, {
        upColor: "#00c853",
        downColor: "#ff1744",
        borderVisible: false,
        wickUpColor: "#00c853",
        wickDownColor: "#ff1744",
      });
      series.setData(data);
    } else if (chartType === "line") {
      const series = chart.addSeries(LineSeries, {
        color: "#2979ff",
        lineWidth: 2,
      });
      series.setData(data.map((d) => ({ time: d.time, value: d.close })));
    } else {
      const series = chart.addSeries(BarSeries, {
        upColor: "#00c853",
        downColor: "#ff1744",
      });
      series.setData(data);
    }

    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [selectedInstrument?.id, chartType, timeframe]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
}
