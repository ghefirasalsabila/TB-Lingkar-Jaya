import { useEffect } from "react";

export function usePendingItemFocus({
  pendingItemFocusIndex,
  showForm,
  itemSelectRefs,
  itemRowRefs,
  itemCount,
  onSettled,
}) {
  useEffect(() => {
    if (pendingItemFocusIndex === null || !showForm) return;

    let frameId = 0;
    let nestedFrameId = 0;
    let focusTimeoutId = 0;

    frameId = window.requestAnimationFrame(() => {
      nestedFrameId = window.requestAnimationFrame(() => {
        const target = itemSelectRefs.current[pendingItemFocusIndex];
        const targetRow = itemRowRefs.current[pendingItemFocusIndex];
        if (!target) return;

        const scrollContainer =
          targetRow?.closest("[data-transaction-sheet-body]") || target.closest("[data-transaction-sheet-body]");

        if (scrollContainer && targetRow) {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: "smooth",
          });
        } else if (targetRow) {
          targetRow.scrollIntoView({ behavior: "smooth", block: "end" });
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "end" });
        }

        focusTimeoutId = window.setTimeout(() => {
          target.focus({ preventScroll: true });
          onSettled();
        }, 260);
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(nestedFrameId);
      window.clearTimeout(focusTimeoutId);
    };
  }, [itemCount, itemRowRefs, itemSelectRefs, onSettled, pendingItemFocusIndex, showForm]);
}
