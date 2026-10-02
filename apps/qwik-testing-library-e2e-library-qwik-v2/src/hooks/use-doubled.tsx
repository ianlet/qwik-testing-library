import { type Signal, useComputed$ } from "@qwik.dev/core";

export function useDoubled(source: Signal<number>) {
  return useComputed$(() => source.value * 2);
}
