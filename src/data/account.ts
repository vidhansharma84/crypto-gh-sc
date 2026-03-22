import type { AccountInfo, AccountNotification } from "@/types/account";

export const mockAccount: AccountInfo = {
  accountId: "MT5-892471",
  name: "John Trader",
  balance: 25430.50,
  equity: 26182.75,
  margin: 4250.00,
  freeMargin: 21932.75,
  marginLevel: 615.95,
  unrealizedPL: 752.25,
  currency: "USD",
};

export const mockNotifications: AccountNotification[] = [
  {
    id: "notif-1",
    type: "success",
    title: "Order Executed",
    message: "Buy EUR/USD 1.0 lot at 1.08542",
    timestamp: "2026-03-23T10:30:00Z",
    isRead: false,
  },
  {
    id: "notif-2",
    type: "success",
    title: "Take Profit Hit",
    message: "XAU/USD position closed at 2355.80 (+$22.65)",
    timestamp: "2026-03-22T08:00:00Z",
    isRead: false,
  },
  {
    id: "notif-3",
    type: "warning",
    title: "Margin Warning",
    message: "Your margin level is approaching 150%. Consider closing positions.",
    timestamp: "2026-03-21T16:45:00Z",
    isRead: true,
  },
  {
    id: "notif-4",
    type: "info",
    title: "Market Open",
    message: "US Stock market is now open for trading.",
    timestamp: "2026-03-21T14:30:00Z",
    isRead: true,
  },
  {
    id: "notif-5",
    type: "success",
    title: "Deposit Received",
    message: "$5,000.00 has been credited to your account.",
    timestamp: "2026-03-20T09:00:00Z",
    isRead: true,
  },
  {
    id: "notif-6",
    type: "error",
    title: "Order Rejected",
    message: "Buy TSLA 50 lots - Insufficient margin.",
    timestamp: "2026-03-19T15:20:00Z",
    isRead: true,
  },
  {
    id: "notif-7",
    type: "info",
    title: "Economic Event",
    message: "US Non-Farm Payrolls release in 30 minutes.",
    timestamp: "2026-03-23T13:00:00Z",
    isRead: false,
  },
];
