import { component$, useSignal } from "@qwik.dev/core";

export const Counter = component$(() => {
  const count = useSignal(0);

  return (
    <div>
      <p>Count: {count.value}</p>
      <button onClick$={() => count.value++}>Increment</button>
    </div>
  );
});
