import { $, useSignal } from "@qwik.dev/core";

export function useCounter(initial = 0) {
  const count = useSignal(initial);
  const increment$ = $(() => count.value++);

  return { count, increment$ };
}
