import { component$, Slot, useSignal } from "@builder.io/qwik";

export const QwikSlot = component$(() => {
  const active = useSignal(false);

  return (
    <div>
      <div>
        <Slot />
      </div>
      <div>
        <Slot name="foo" />
      </div>
      <div>{active.value && <Slot name="conditional" />}</div>
      <button onClick$={() => (active.value = !active.value)}>update</button>
    </div>
  );
});
