export function scheduleDeferredTask(task) {
  const timeoutId = window.setTimeout(() => {
    void task();
  }, 0);

  return () => {
    window.clearTimeout(timeoutId);
  };
}
