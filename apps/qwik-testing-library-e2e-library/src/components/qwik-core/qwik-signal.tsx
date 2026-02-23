import { component$, useSignal } from "@builder.io/qwik";

export const QwikSignal = component$(() => {
  const sig = useSignal("my-signal");

  return (
    <div>
      {sig.value}
      <button onClick$={() => (sig.value = "updated-signal")}>update</button>
    </div>
  );
});
