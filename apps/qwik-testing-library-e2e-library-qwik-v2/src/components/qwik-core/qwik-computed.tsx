import { component$, useComputed$, useSignal } from "@qwik.dev/core";

export const QwikComputed = component$(() => {
  const sig = useSignal(0);

  const computed = useComputed$(() => {
    return "computed-value-" + sig.value;
  });

  return (
    <div>
      {computed.value}
      <button onClick$={() => sig.value++}>update</button>
    </div>
  );
});
