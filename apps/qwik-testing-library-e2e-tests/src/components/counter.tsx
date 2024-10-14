import { $, component$, QRL, useSignal } from "@builder.io/qwik";

interface CounterProps {
  onChange$: QRL<(value: number) => void>;
}

export const Counter = component$<CounterProps>(({ onChange$ }) => {
  const count = useSignal(0);

  const handleIncrement = $(() => {
    count.value++;
    return onChange$(count.value);
  });

  const handleDecrement = $(() => {
    count.value--;
    return onChange$(count.value);
  });

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick$={handleIncrement}>Increment</button>
      <button onClick$={handleDecrement}>Decrement</button>
    </div>
  );
});
