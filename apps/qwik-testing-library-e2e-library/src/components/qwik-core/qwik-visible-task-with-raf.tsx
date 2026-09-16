import {
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@qwik.dev/core";

/**
 * Models a component (like a modal's closing layer) that has BOTH a `useVisibleTask$` and a side
 * effect scheduled on `window.requestAnimationFrame`.
 *
 * render() drains the visible task, which happens on the platform's timer. The rAF-scheduled effect
 * must NOT fire as a side effect of that drain — otherwise a component that unmounts/mutates itself
 * on the next animation frame would do so *during* render(), and a test could never observe the
 * just-mounted state. The effect still runs on the next real frame, after render() returns.
 */
export const QwikVisibleTaskWithRaf = component$(() => {
  const framePassed = useSignal(false);
  const visibleRan = useSignal(false);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    visibleRan.value = true;
  });

  useTask$(() => {
    if (typeof requestAnimationFrame === "undefined") {
      return;
    }
    requestAnimationFrame(() => {
      framePassed.value = true;
    });
  });

  return (
    <div>
      <span data-testid="frame">
        {framePassed.value ? "frame-passed" : "before-frame"}
      </span>
      <span data-testid="visible">
        {visibleRan.value ? "visible-ran" : "visible-pending"}
      </span>
    </div>
  );
});
