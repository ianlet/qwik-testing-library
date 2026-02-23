import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export const QwikVisibleTask = component$(() => {
  const sig = useSignal(0);
  const foo = useSignal<string>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
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
