import { type Signal, useComputed$ } from "@builder.io/qwik";

export function useDoubled(source: Signal<number>) {
  return useComputed$(() => source.value * 2);
}
