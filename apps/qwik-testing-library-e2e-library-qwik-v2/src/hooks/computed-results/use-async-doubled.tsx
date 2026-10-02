import { type Signal, useComputed$ } from "@qwik.dev/core";

export function useAsyncDoubled(source: Signal<number>) {
  return useComputed$(async () => {
    const value = source.value;
    await new Promise((resolve) => setTimeout(resolve, 20));
    return value * 2;
  });
}
