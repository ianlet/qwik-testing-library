import { type Signal, useComputed$ } from "@qwik.dev/core";
import { factor } from "./slow-factor";

export function useSlowlyDoubled(source: Signal<number>) {
  return useComputed$(() => source.value * factor);
}
