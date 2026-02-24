import { type Signal, useSignal, useTask$ } from "@builder.io/qwik";

export function useDerived(source: Signal<number>) {
  const derived = useSignal<string>();

  useTask$(({ track }) => {
    const value = track(source);
    derived.value = "derived-" + value;
  });

  return derived;
}
