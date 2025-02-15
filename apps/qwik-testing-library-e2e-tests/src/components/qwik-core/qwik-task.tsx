import { component$, useSignal, useTask$ } from "@builder.io/qwik";

export const QwikTask = component$(() => {
  const sig = useSignal(0);
  const foo = useSignal<string>();

  useTask$(({ track }) => {
    const value = track(sig);

    foo.value = "foo-" + value;
  });

  return (
    <div>
      {foo.value}
      <button onClick$={() => sig.value++}>update</button>
    </div>
  );
});
