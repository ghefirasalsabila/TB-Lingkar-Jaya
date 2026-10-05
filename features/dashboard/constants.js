export const CATEGORY_COLORS = [
  "#0d9488", "#0891b2", "#7c3aed", "#db2777",
  "#ea580c", "#ca8a04", "#16a34a", "#6366f1",
  "#e11d48", "#059669", "#d97706", "#8b5cf6",
];

export const HEALTH_COLORS = {
  safe: "#22c55e",
  warning: "#f59e0b",
  critical: "#ef4444",
};

export const DASHBOARD_HEALTH_STYLES = {
  critical: {
    label: "Kritis",
    badgeClassName: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300",
    textClassName: "text-rose-700 dark:text-rose-300",
  },
  warning: {
    label: "Menipis",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300",
    textClassName: "text-amber-700 dark:text-amber-300",
  },
  safe: {
    label: "Aman",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300",
    textClassName: "text-emerald-700 dark:text-emerald-300",
  },
};

export const DASHBOARD_ICON_TONES = {
  restock: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
  topSeller: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  stock: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400",
  incoming: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  outgoing: "bg-rose-50 text-rose-500 dark:bg-rose-950 dark:text-rose-400",
  revenue: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
};

export const DASHBOARD_PREVIEW_TONES = {
  restock: "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300",
  topSeller: "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300",
  safe: "rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300",
};

export const DASHBOARD_TEXT_TONES = {
  incoming: "text-teal-600 dark:text-teal-300",
  outgoing: "text-rose-500 dark:text-rose-300",
  sales: "text-emerald-600 dark:text-emerald-300",
  purchases: "text-orange-500 dark:text-orange-300",
};

export const DASHBOARD_PROGRESS_TRACK_CLASS = "bg-muted/70";
export const DASHBOARD_FEATURED_BADGE_CLASS = "rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300";
export const DASHBOARD_FEATURED_CARD_CLASS = "rounded-2xl border bg-card p-5";
export const DASHBOARD_TOP_PRODUCTS_HEADER_CLASS = "gap-4 border-b";

export const DASHBOARD_TREND_SERIES_COLORS = {
  incomingQty: "#0d9488",
  outgoingQty: "#f43f5e",
  salesAmount: "#059669",
  purchaseAmount: "#ea580c",
};

export const SKELETON_BAR_HEIGHTS = [42, 58, 34, 67, 49, 73, 55, 61];

export const TOP_PRODUCTS_BATCH_SIZE = 12;

export const DASHBOARD_PERIOD_PRESETS = [
  { value: "last30", label: "30 hari terakhir" },
  { value: "thisMonth", label: "Bulan ini" },
  { value: "lastMonth", label: "Bulan lalu" },
  { value: "month", label: "Pilih bulan" },
  { value: "custom", label: "Kustom" },
  { value: "allTime", label: "Semua waktu" },
];

export const TOP_PRODUCT_RANK_THEMES = [
  {
    badgeClassName: DASHBOARD_FEATURED_BADGE_CLASS,
    barClassName: "bg-amber-500"
  },
  {
    badgeClassName: "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
    barClassName: "bg-slate-500"
  },
  {
    badgeClassName: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-300",
    barClassName: "bg-orange-400"
  },
  {
    badgeClassName: "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-500/40 dark:bg-teal-500/10 dark:text-teal-300",
    barClassName: "bg-teal-500"
  },
  {
    badgeClassName: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300",
    barClassName: "bg-indigo-500"
  }
];
