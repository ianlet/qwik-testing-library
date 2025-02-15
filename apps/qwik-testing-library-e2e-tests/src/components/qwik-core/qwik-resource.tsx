import {
  component$,
  Resource,
  useResource$,
  useSignal,
} from "@builder.io/qwik";

function getResource(value: number): Promise<string> {
  return Promise.resolve("resource-" + value);
}

export const QwikResource = component$(() => {
  const sig = useSignal(0);

  const resource = useResource$(({ track }) => {
    const value = track(sig);
    return getResource(value);
  });

  return (
    <div>
      <Resource value={resource} onResolved={(value) => <>{value}</>} />
      <button onClick$={() => sig.value++}>update</button>
    </div>
  );
});
