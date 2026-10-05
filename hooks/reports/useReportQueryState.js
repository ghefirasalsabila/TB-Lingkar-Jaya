import { useEffect, useMemo, useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  getDateRangeLabel,
  getDefaultReportRange,
  getInclusiveDayCount,
  getReportTypeLabel,
  REPORTS_DEFAULT_PAGE,
} from "../../features/reports/report-utils";

function parsePositiveInt(value, fallbackValue) {
  const parsedValue = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallbackValue;
}

function createDraftState(range, reportType) {
  return {
    range,
    draftReportType: reportType,
  };
}

function draftReducer(state, action) {
  if (action.type === "sync") {
    return createDraftState(action.range, action.reportType);
  }

  if (action.type === "change-range") {
    return {
      ...state,
      range: {
        ...state.range,
        [action.field]: action.value,
      },
    };
  }

  if (action.type === "change-type") {
    return {
      ...state,
      draftReportType: action.value || "summary",
    };
  }

  return state;
}

export function useReportQueryState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultRange = getDefaultReportRange();
  const appliedRange = useMemo(() => ({
    from: searchParams.get("from") || defaultRange.from,
    to: searchParams.get("to") || defaultRange.to,
  }), [defaultRange.from, defaultRange.to, searchParams]);
  const appliedReportType = searchParams.get("type") || "summary";
  const [draftState, dispatchDraft] = useReducer(
    draftReducer,
    { range: appliedRange, reportType: appliedReportType },
    ({ range, reportType }) => createDraftState(range, reportType),
  );
  const page = parsePositiveInt(searchParams.get("page"), REPORTS_DEFAULT_PAGE);

  useEffect(() => {
    dispatchDraft({
      type: "sync",
      range: appliedRange,
      reportType: appliedReportType,
    });
  }, [appliedRange, appliedReportType]);

  const query = useMemo(() => ({ from: appliedRange.from, to: appliedRange.to }), [appliedRange.from, appliedRange.to]);
  const activeRangeLabel = useMemo(() => getDateRangeLabel(appliedRange.from, appliedRange.to), [appliedRange.from, appliedRange.to]);
  const selectedDayCount = useMemo(() => getInclusiveDayCount(appliedRange.from, appliedRange.to), [appliedRange.from, appliedRange.to]);
  const reportTypeLabel = getReportTypeLabel(appliedReportType);

  function handleRangeChange(field, value) {
    dispatchDraft({ type: "change-range", field, value });
  }

  function handleReportTypeChange(value) {
    dispatchDraft({ type: "change-type", value });
  }

  function handlePageChange(nextPage) {
    const nextParams = new URLSearchParams(searchParams);

    if (nextPage > REPORTS_DEFAULT_PAGE) {
      nextParams.set("page", String(nextPage));
    } else {
      nextParams.delete("page");
    }

    setSearchParams(nextParams, { replace: true });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const { range, draftReportType } = draftState;

    if (!range.from || !range.to) {
      toast.error("Lengkapi tanggal mulai dan tanggal akhir.");
      return;
    }

    if (range.from > range.to) {
      toast.error("Tanggal mulai tidak boleh melewati tanggal akhir.");
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("from", range.from);
    nextParams.set("to", range.to);

    if (draftReportType && draftReportType !== "summary") {
      nextParams.set("type", draftReportType);
    } else {
      nextParams.delete("type");
    }

    nextParams.delete("page");
    setSearchParams(nextParams, { replace: true });
  }

  return {
    range: draftState.range,
    reportType: appliedReportType,
    draftReportType: draftState.draftReportType,
    page,
    query,
    activeRangeLabel,
    selectedDayCount,
    reportTypeLabel,
    handleRangeChange,
    handleReportTypeChange,
    handleSubmit,
    setPage: handlePageChange,
  };
}
