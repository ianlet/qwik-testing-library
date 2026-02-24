import { $, useSignal } from "@builder.io/qwik";

export function useCounter(initial = 0) {
  const count = useSignal(initial);
  const increment$ = $(() => count.value++);

  return { count, increment$ };
}
