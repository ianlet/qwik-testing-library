import { $, component$, useStore } from "@qwik.dev/core";

export const QwikStore = component$(() => {
  const store = useStore<{ foo: string; bar: string }>({
    foo: "foo",
    bar: "bar",
  });

  return (
    <div>
      {store.foo} - {store.bar}
      <button
        onClick$={$(() => {
          store.foo = "bar";
          store.bar = "baz";
        })}
      >
        update
      </button>
    </div>
  );
});
