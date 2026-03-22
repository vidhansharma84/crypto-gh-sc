import { create } from "zustand";
import type { Instrument, AssetCategory } from "@/types/instrument";
import type { OrderFormState, Position, PendingOrder, TradeHistoryEntry } from "@/types/order";
import type { Timeframe, ChartType } from "@/types/chart";
import type { AccountInfo } from "@/types/account";
import { mockPositions } from "@/data/mock-positions";
import { mockPendingOrders } from "@/data/mock-orders";
import { mockTradeHistory } from "@/data/mock-history";
import { mockAccount } from "@/data/account";

interface TradingStore {
  // Selected instrument
  selectedInstrument: Instrument | null;
  setSelectedInstrument: (instrument: Instrument) => void;

  // Sidebar state
  expandedCategories: AssetCategory[];
  toggleCategory: (category: AssetCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Chart state
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  chartType: ChartType;
  setChartType: (ct: ChartType) => void;

  // Order form
  orderForm: OrderFormState;
  updateOrderForm: (updates: Partial<OrderFormState>) => void;
  resetOrderForm: () => void;

  // Positions & orders
  positions: Position[];
  pendingOrders: PendingOrder[];
  tradeHistory: TradeHistoryEntry[];

  // Account
  account: AccountInfo;

  // Bottom panel
  activeBottomTab: "positions" | "pending" | "history" | "calendar";
  setActiveBottomTab: (tab: "positions" | "pending" | "history" | "calendar") => void;

  // Sidebar visibility (for mobile)
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const defaultOrderForm: OrderFormState = {
  side: "buy",
  type: "market",
  amount: 1.0,
  leverage: 100,
  stopLoss: null,
  takeProfit: null,
  limitPrice: null,
  stopLossEnabled: false,
  takeProfitEnabled: false,
};

export const useTradingStore = create<TradingStore>((set) => ({
  // Selected instrument
  selectedInstrument: null,
  setSelectedInstrument: (instrument) => set({ selectedInstrument: instrument }),

  // Sidebar
  expandedCategories: ["forex"],
  toggleCategory: (category) =>
    set((state) => ({
      expandedCategories: state.expandedCategories.includes(category)
        ? state.expandedCategories.filter((c) => c !== category)
        : [...state.expandedCategories, category],
    })),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Chart
  timeframe: "1h",
  setTimeframe: (tf) => set({ timeframe: tf }),
  chartType: "candlestick",
  setChartType: (ct) => set({ chartType: ct }),

  // Order form
  orderForm: defaultOrderForm,
  updateOrderForm: (updates) =>
    set((state) => ({
      orderForm: { ...state.orderForm, ...updates },
    })),
  resetOrderForm: () => set({ orderForm: defaultOrderForm }),

  // Data
  positions: mockPositions,
  pendingOrders: mockPendingOrders,
  tradeHistory: mockTradeHistory,

  // Account
  account: mockAccount,

  // Bottom panel
  activeBottomTab: "positions",
  setActiveBottomTab: (tab) => set({ activeBottomTab: tab }),

  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
