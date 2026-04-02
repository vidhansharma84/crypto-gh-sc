"use client";

import { useState } from "react";
import { useTradingStore } from "@/store/trading-store";
import { cn } from "@/lib/utils";
import { LEVERAGE_OPTIONS } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";
import type { OrderType } from "@/types/order";

const QUICK_AMOUNTS = [0.01, 0.1, 0.5, 1.0, 2.0];
const ORDER_TYPES: { label: string; value: OrderType }[] = [
  { label: "Market", value: "market" },
  { label: "Limit", value: "limit" },
  { label: "Stop", value: "stop" },
];

export function OrderForm() {
  const { selectedInstrument, orderForm, updateOrderForm, placeOrder, isAuthenticated } = useTradingStore();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  if (!selectedInstrument) return null;

  const decimals =
    selectedInstrument.pipSize < 0.01
      ? 5
      : selectedInstrument.pipSize < 1
        ? 2
        : 0;

  const spread = (selectedInstrument.ask - selectedInstrument.bid).toFixed(
    decimals
  );
  const requiredMargin =
    (selectedInstrument.bid * orderForm.amount * selectedInstrument.lotSize) /
    orderForm.leverage;

  return (
    <div className="flex flex-col p-3 gap-4 sm:gap-3">
      {/* Instrument Header */}
      <div className="text-center pb-2 border-b border-border-primary">
        <div className="font-semibold text-sm text-text-primary">
          {selectedInstrument.symbol}
        </div>
        <div className="flex justify-center gap-4 mt-1">
          <div className="text-[10px]">
            <span className="text-text-tertiary">Bid </span>
            <span className="font-mono text-trading-red text-xs">
              {selectedInstrument.bid.toFixed(decimals)}
            </span>
          </div>
          <div className="text-[10px]">
            <span className="text-text-tertiary">Ask </span>
            <span className="font-mono text-trading-green text-xs">
              {selectedInstrument.ask.toFixed(decimals)}
            </span>
          </div>
        </div>
      </div>

      {/* Buy/Sell Toggle */}
      <div className="grid grid-cols-2 gap-1">
        <button
          onClick={() => updateOrderForm({ side: "buy" })}
          className={cn(
            "py-2.5 rounded text-xs font-bold transition-all",
            orderForm.side === "buy"
              ? "bg-trading-green text-white"
              : "bg-trading-green/15 text-trading-green hover:bg-trading-green/25"
          )}
        >
          BUY
        </button>
        <button
          onClick={() => updateOrderForm({ side: "sell" })}
          className={cn(
            "py-2.5 rounded text-xs font-bold transition-all",
            orderForm.side === "sell"
              ? "bg-trading-red text-white"
              : "bg-trading-red/15 text-trading-red hover:bg-trading-red/25"
          )}
        >
          SELL
        </button>
      </div>

      {/* Order Type */}
      <div className="flex border-b border-border-primary">
        {ORDER_TYPES.map((ot) => (
          <button
            key={ot.value}
            onClick={() => updateOrderForm({ type: ot.value })}
            className={cn(
              "flex-1 pb-2 text-[11px] transition-colors border-b-2",
              orderForm.type === ot.value
                ? "text-trading-blue border-trading-blue"
                : "text-text-tertiary border-transparent hover:text-text-secondary"
            )}
          >
            {ot.label}
          </button>
        ))}
      </div>

      {/* Volume */}
      <div>
        <label className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1 block">
          Volume (Lots)
        </label>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              updateOrderForm({
                amount: Math.max(0.01, orderForm.amount - 0.01),
              })
            }
            className="w-8 h-8 flex items-center justify-center bg-bg-tertiary border border-border-primary rounded text-text-secondary hover:bg-bg-hover text-sm"
          >
            -
          </button>
          <input
            type="number"
            value={orderForm.amount}
            onChange={(e) =>
              updateOrderForm({ amount: parseFloat(e.target.value) || 0.01 })
            }
            className="flex-1 h-8 px-2 text-center text-xs font-mono bg-bg-tertiary border border-border-primary rounded text-text-primary focus:outline-none focus:border-trading-blue"
            step="0.01"
            min="0.01"
          />
          <button
            onClick={() => updateOrderForm({ amount: orderForm.amount + 0.01 })}
            className="w-8 h-8 flex items-center justify-center bg-bg-tertiary border border-border-primary rounded text-text-secondary hover:bg-bg-hover text-sm"
          >
            +
          </button>
        </div>
        <div className="flex gap-1 mt-1.5">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => updateOrderForm({ amount: amt })}
              className={cn(
                "flex-1 py-1 text-[10px] rounded border transition-colors",
                orderForm.amount === amt
                  ? "border-trading-blue text-trading-blue bg-trading-blue/10"
                  : "border-border-primary text-text-tertiary hover:text-text-secondary hover:border-border-primary"
              )}
            >
              {amt}
            </button>
          ))}
        </div>
      </div>

      {/* Limit/Stop Price */}
      {orderForm.type !== "market" && (
        <div>
          <label className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1 block">
            {orderForm.type === "limit" ? "Limit Price" : "Stop Price"}
          </label>
          <input
            type="number"
            value={
              orderForm.limitPrice ?? selectedInstrument.bid.toFixed(decimals)
            }
            onChange={(e) =>
              updateOrderForm({ limitPrice: parseFloat(e.target.value) })
            }
            className="w-full h-8 px-3 text-xs font-mono bg-bg-tertiary border border-border-primary rounded text-text-primary focus:outline-none focus:border-trading-blue"
            step={selectedInstrument.pipSize}
          />
        </div>
      )}

      {/* Leverage */}
      <div>
        <label className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1 block">
          Leverage
        </label>
        <select
          value={orderForm.leverage}
          onChange={(e) =>
            updateOrderForm({ leverage: parseInt(e.target.value) })
          }
          className="w-full h-8 px-2 text-xs bg-bg-tertiary border border-border-primary rounded text-text-primary focus:outline-none focus:border-trading-blue appearance-none cursor-pointer"
        >
          {LEVERAGE_OPTIONS.map((lev) => (
            <option key={lev} value={lev}>
              1:{lev}
            </option>
          ))}
        </select>
      </div>

      {/* Stop Loss */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] text-text-tertiary uppercase tracking-wider">
            Stop Loss
          </label>
          <button
            onClick={() =>
              updateOrderForm({
                stopLossEnabled: !orderForm.stopLossEnabled,
                stopLoss: !orderForm.stopLossEnabled
                  ? selectedInstrument.bid * (orderForm.side === "buy" ? 0.98 : 1.02)
                  : null,
              })
            }
            className={cn(
              "w-8 h-4 rounded-full transition-colors relative",
              orderForm.stopLossEnabled ? "bg-trading-blue" : "bg-border-primary"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform",
                orderForm.stopLossEnabled ? "left-4.5" : "left-0.5"
              )}
            />
          </button>
        </div>
        {orderForm.stopLossEnabled && (
          <input
            type="number"
            value={orderForm.stopLoss?.toFixed(decimals) ?? ""}
            onChange={(e) =>
              updateOrderForm({ stopLoss: parseFloat(e.target.value) })
            }
            className="w-full h-8 px-3 text-xs font-mono bg-bg-tertiary border border-border-primary rounded text-text-primary focus:outline-none focus:border-trading-red"
            step={selectedInstrument.pipSize}
          />
        )}
      </div>

      {/* Take Profit */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] text-text-tertiary uppercase tracking-wider">
            Take Profit
          </label>
          <button
            onClick={() =>
              updateOrderForm({
                takeProfitEnabled: !orderForm.takeProfitEnabled,
                takeProfit: !orderForm.takeProfitEnabled
                  ? selectedInstrument.bid * (orderForm.side === "buy" ? 1.03 : 0.97)
                  : null,
              })
            }
            className={cn(
              "w-8 h-4 rounded-full transition-colors relative",
              orderForm.takeProfitEnabled ? "bg-trading-blue" : "bg-border-primary"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform",
                orderForm.takeProfitEnabled ? "left-4.5" : "left-0.5"
              )}
            />
          </button>
        </div>
        {orderForm.takeProfitEnabled && (
          <input
            type="number"
            value={orderForm.takeProfit?.toFixed(decimals) ?? ""}
            onChange={(e) =>
              updateOrderForm({ takeProfit: parseFloat(e.target.value) })
            }
            className="w-full h-8 px-3 text-xs font-mono bg-bg-tertiary border border-border-primary rounded text-text-primary focus:outline-none focus:border-trading-green"
            step={selectedInstrument.pipSize}
          />
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-bg-tertiary rounded p-2 space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span className="text-text-tertiary">Spread</span>
          <span className="text-text-secondary font-mono">{spread}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-tertiary">Required Margin</span>
          <span className="text-text-secondary font-mono">
            {formatCurrency(requiredMargin)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-tertiary">Commission</span>
          <span className="text-text-secondary font-mono">$7.00</span>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={cn(
            "text-xs text-center py-1.5 rounded",
            feedback.type === "success"
              ? "bg-trading-green/15 text-trading-green"
              : "bg-trading-red/15 text-trading-red"
          )}
        >
          {feedback.msg}
        </div>
      )}

      {/* Execute Button */}
      <button
        onClick={() => {
          if (!isAuthenticated) {
            setFeedback({ type: "error", msg: "Please login to trade" });
            setTimeout(() => setFeedback(null), 3000);
            return;
          }
          const err = placeOrder();
          if (err) {
            setFeedback({ type: "error", msg: err });
          } else {
            setFeedback({ type: "success", msg: `Order placed: ${orderForm.side.toUpperCase()} ${selectedInstrument.symbol}` });
          }
          setTimeout(() => setFeedback(null), 3000);
        }}
        className={cn(
          "w-full py-3 rounded-lg font-bold text-sm text-white transition-all active:scale-[0.98]",
          orderForm.side === "buy"
            ? "bg-trading-green hover:bg-trading-green/90"
            : "bg-trading-red hover:bg-trading-red/90"
        )}
      >
        {orderForm.side === "buy" ? "BUY" : "SELL"} {selectedInstrument.symbol}
      </button>
    </div>
  );
}
