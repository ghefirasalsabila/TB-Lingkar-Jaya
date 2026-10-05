import { api } from "./core";
import { unwrap } from "./helpers";

export async function getDashboardSummary({ trendMonth, trendYear, from, to, allTime } = {}) {
  const params = {};
  if (trendMonth) params.trendMonth = trendMonth;
  if (trendYear) params.trendYear = trendYear;
  if (from) params.from = from;
  if (to) params.to = to;
  if (allTime) params.allTime = true;

  const response = await api.get("/dashboard/summary", { params, skipSuccessToast: true });
  return unwrap(response);
}
