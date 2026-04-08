import { create } from "zustand";
import type { Instrument, AssetCategory } from "@/types/instrument";
import type { OrderFormState, Position, PendingOrder, TradeHistoryEntry } from "@/types/order";
import type { Timeframe, ChartType } from "@/types/chart";
import type { AccountInfo } from "@/types/account";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  balance: number;
}

interface TradingStore {
  // Auth
  isAuthenticated: boolean;
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;

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

  // Trading
  positions: Position[];
  pendingOrders: PendingOrder[];
  tradeHistory: TradeHistoryEntry[];
  placeOrder: () => string | null; // returns error message or null
  closePosition: (positionId: string) => void;
  updatePositionPrices: () => void;
  loadUserData: () => Promise<void>;

  // Account (computed from wallet + positions)
  account: AccountInfo;

  // Bottom panel
  activeBottomTab: "positions" | "pending" | "history" | "calendar";
  setActiveBottomTab: (tab: "positions" | "pending" | "history" | "calendar") => void;

  // Mobile visibility
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  orderPanelOpen: boolean;
  toggleOrderPanel: () => void;
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

function calcPL(pos: Position): number {
  const diff = pos.side === "buy"
    ? pos.currentPrice - pos.openPrice
    : pos.openPrice - pos.currentPrice;
  return parseFloat((diff * pos.quantity * 1000).toFixed(2));
}

function computeAccount(positions: Position[], walletBalance: number): AccountInfo {
  const unrealizedPL = positions.reduce((sum, p) => sum + p.profitLoss, 0);
  const totalMargin = positions.reduce((sum, p) => sum + p.margin, 0);
  const balance = walletBalance;
  const equity = balance + unrealizedPL;
  const freeMargin = equity - totalMargin;
  const marginLevel = totalMargin > 0 ? (equity / totalMargin) * 100 : 0;

  return {
    accountId: "FNX-LIVE",
    name: "FNX Trading",
    balance,
    equity: parseFloat(equity.toFixed(2)),
    margin: parseFloat(totalMargin.toFixed(2)),
    freeMargin: parseFloat(freeMargin.toFixed(2)),
    marginLevel: parseFloat(marginLevel.toFixed(2)),
    unrealizedPL: parseFloat(unrealizedPL.toFixed(2)),
    currency: "USD",
  };
}

export const useTradingStore = create<TradingStore>((set, get) => ({
  // Auth
  isAuthenticated: false,
  user: null,
  setUser: (user) => {
    const positions = get().positions;
    set({
      user,
      isAuthenticated: !!user,
      account: computeAccount(positions, user?.balance ?? 0),
    });
    if (user) {
      get().loadUserData();
    }
  },
  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({
      user: null,
      isAuthenticated: false,
      positions: [],
      pendingOrders: [],
      tradeHistory: [],
      account: computeAccount([], 0),
    });
  },
  fetchUser: async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        set({
          user: data.user,
          isAuthenticated: true,
        });
        // Load positions/history/orders from DB
        await get().loadUserData();
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },

  // Load all user trading data from MySQL
  loadUserData: async () => {
    try {
      const [posRes, histRes, ordRes] = await Promise.all([
        fetch("/api/positions"),
        fetch("/api/trade-history"),
        fetch("/api/pending-orders"),
      ]);

      const positions = posRes.ok ? (await posRes.json()).positions : [];
      const tradeHistory = histRes.ok ? (await histRes.json()).history : [];
      const pendingOrders = ordRes.ok ? (await ordRes.json()).orders : [];

      const walletBalance = get().user?.balance ?? 0;
      set({
        positions,
        tradeHistory,
        pendingOrders,
        account: computeAccount(positions, walletBalance),
      });
    } catch {
      // Keep existing state on error
    }
  },

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

  // Trading
  positions: [],
  pendingOrders: [],
  tradeHistory: [],

  placeOrder: () => {
    const state = get();
    const { selectedInstrument, orderForm, user, positions } = state;

    if (!selectedInstrument) return "No instrument selected";
    if (!user) return "Please login to trade";

    const price = orderForm.side === "buy" ? selectedInstrument.ask : selectedInstrument.bid;
    const margin = parseFloat(
      ((price * orderForm.amount * selectedInstrument.lotSize) / orderForm.leverage).toFixed(2)
    );

    // Check wallet balance
    const currentAccount = computeAccount(positions, user.balance);
    if (margin > currentAccount.freeMargin) {
      return "Insufficient balance. Add funds from admin.";
    }

    const position: Position = {
      id: `pos-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      instrumentId: selectedInstrument.id,
      symbol: selectedInstrument.symbol,
      side: orderForm.side,
      type: orderForm.type,
      openPrice: price,
      currentPrice: price,
      quantity: orderForm.amount,
      leverage: orderForm.leverage,
      stopLoss: orderForm.stopLossEnabled ? orderForm.stopLoss : null,
      takeProfit: orderForm.takeProfitEnabled ? orderForm.takeProfit : null,
      profitLoss: 0,
      profitLossPercent: 0,
      margin,
      swap: 0,
      commission: 7,
      openTime: new Date().toISOString(),
      status: "open",
    };

    const newPositions = [...positions, position];

    // Save position to MySQL and deduct margin
    fetch("/api/positions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(position),
    });

    fetch("/api/wallet/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: -margin }),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          set((s) => ({
            user: s.user ? { ...s.user, balance: data.balance } : null,
            account: computeAccount(s.positions, data.balance),
          }));
        });
      }
    });

    set({
      positions: newPositions,
      account: computeAccount(newPositions, user.balance - margin),
    });

    return null; // success
  },

  closePosition: (positionId: string) => {
    const state = get();
    const pos = state.positions.find((p) => p.id === positionId);
    if (!pos || !state.user) return;

    const pnl = pos.profitLoss;
    const returnAmount = pos.margin + pnl;

    const closeTime = new Date().toISOString();
    const duration = formatDuration(new Date(pos.openTime), new Date());

    // Create history entry
    const historyEntry: TradeHistoryEntry = {
      ...pos,
      closePrice: pos.currentPrice,
      closeTime,
      duration,
      status: "closed",
    };

    const newPositions = state.positions.filter((p) => p.id !== positionId);

    // Persist to MySQL: move position to trade_history and update wallet
    fetch("/api/positions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        positionId,
        closePrice: pos.currentPrice,
        closeTime,
        duration,
        profitLoss: pos.profitLoss,
        profitLossPercent: pos.profitLossPercent,
      }),
    });

    fetch("/api/wallet/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: returnAmount }),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          set((s) => ({
            user: s.user ? { ...s.user, balance: data.balance } : null,
            account: computeAccount(s.positions, data.balance),
          }));
        });
      }
    });

    set({
      positions: newPositions,
      tradeHistory: [historyEntry, ...state.tradeHistory],
      account: computeAccount(newPositions, state.user.balance + returnAmount),
    });
  },

  updatePositionPrices: () => {
    const state = get();
    if (state.positions.length === 0) return;

    const instrument = state.selectedInstrument;
    if (!instrument) return;

    const updated = state.positions.map((pos) => {
      if (pos.instrumentId === instrument.id) {
        const newPrice = pos.side === "buy" ? instrument.bid : instrument.ask;
        const updatedPos = { ...pos, currentPrice: newPrice };
        updatedPos.profitLoss = calcPL(updatedPos);
        updatedPos.profitLossPercent = updatedPos.margin > 0
          ? parseFloat(((updatedPos.profitLoss / updatedPos.margin) * 100).toFixed(2))
          : 0;
        return updatedPos;
      }
      return pos;
    });

    const walletBalance = state.user?.balance ?? 0;
    set({
      positions: updated,
      account: computeAccount(updated, walletBalance),
    });
  },

  // Account
  account: computeAccount([], 0),

  // Bottom panel
  activeBottomTab: "positions",
  setActiveBottomTab: (tab) => set({ activeBottomTab: tab }),

  // Mobile visibility
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  orderPanelOpen: false,
  toggleOrderPanel: () => set((state) => ({ orderPanelOpen: !state.orderPanelOpen })),
}));

function formatDuration(start: Date, end: Date): string {
  const ms = end.getTime() - start.getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}m`;
  const days = Math.floor(hrs / 24);
  return `${days}d ${hrs % 24}h`;
}
