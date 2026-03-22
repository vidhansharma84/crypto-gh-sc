"use client";

import { mockEconomicCalendar } from "@/data/mock-calendar";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/formatters";

const COLUMNS = [
  "Time",
  "Currency",
  "Event",
  "Impact",
  "Forecast",
  "Previous",
  "Actual",
];

const impactColors = {
  high: "bg-trading-red",
  medium: "bg-trading-orange",
  low: "bg-trading-yellow",
};

export function EconomicCalendar() {
  return (
    <table className="w-full text-[11px]">
      <thead>
        <tr className="border-b border-border-secondary">
          {COLUMNS.map((col) => (
            <th
              key={col}
              className="px-2 py-1.5 text-left font-medium text-text-tertiary uppercase tracking-wider whitespace-nowrap"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {mockEconomicCalendar.map((event) => (
          <tr
            key={event.id}
            className="border-b border-border-secondary hover:bg-bg-hover transition-colors"
          >
            <td className="px-2 py-1.5 text-text-tertiary whitespace-nowrap font-mono">
              {formatDateTime(event.time)}
            </td>
            <td className="px-2 py-1.5">
              <span className="inline-block px-1.5 py-0.5 bg-bg-tertiary rounded text-text-primary font-medium text-[10px]">
                {event.currency}
              </span>
            </td>
            <td className="px-2 py-1.5 text-text-primary whitespace-nowrap">
              {event.event}
            </td>
            <td className="px-2 py-1.5">
              <span
                className={cn(
                  "inline-block w-2 h-2 rounded-full",
                  impactColors[event.impact]
                )}
              />
            </td>
            <td className="px-2 py-1.5 font-mono text-text-secondary">
              {event.forecast}
            </td>
            <td className="px-2 py-1.5 font-mono text-text-secondary">
              {event.previous}
            </td>
            <td className="px-2 py-1.5 font-mono text-text-primary font-medium">
              {event.actual}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
