import { useStore } from "@qwik.dev/core";

export function useStoreValue<T extends Record<string, unknown>>(initial: T) {
  return useStore(initial);
}
