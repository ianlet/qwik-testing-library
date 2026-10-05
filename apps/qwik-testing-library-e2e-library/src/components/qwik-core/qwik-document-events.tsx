import { $, component$, useOnDocument, useSignal } from "@builder.io/qwik";

// A dismissible popover, closed by pressing Escape or clicking outside of it.
export const QwikDocumentEvents = component$(() => {
  const open = useSignal(true);
  const popover = useSignal<HTMLElement>();

  useOnDocument(
    "keydown",
    $((event) => {
      if (event.key === "Escape") open.value = false;
    }),
  );

  useOnDocument(
    "click",
    $((event) => {
      if (!popover.value?.contains(event.target as Node)) open.value = false;
    }),
  );

  return (
    <div>
      <button>outside</button>
      <p ref={popover}>{open.value ? "open" : "closed"}</p>
    </div>
  );
});
