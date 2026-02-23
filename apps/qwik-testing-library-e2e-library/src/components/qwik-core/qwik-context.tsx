import {
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";

const MyContext = createContextId<{ foo: string }>("my-context");

export const QwikContext = component$(() => {
  useContextProvider(MyContext, useStore({ foo: "foo" }));

  return (
    <div>
      <Inner />
    </div>
  );
});

const Inner = component$(() => {
  const context = useContext(MyContext);

  return (
    <div>
      context-{context.foo}
      <button onClick$={() => (context.foo = "bar")}>update</button>
    </div>
  );
});
