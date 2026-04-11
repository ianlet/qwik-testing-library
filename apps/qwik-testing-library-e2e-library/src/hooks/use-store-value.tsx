import { useStore } from "@builder.io/qwik";

export function useStoreValue<T extends Record<string, unknown>>(initial: T) {
  return useStore(initial);
}
