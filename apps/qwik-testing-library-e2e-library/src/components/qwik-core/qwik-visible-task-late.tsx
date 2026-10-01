import { component$, useSignal, useVisibleTask$ } from "@qwik.dev/core";

// Counts every run of its visible task on a module-level counter, so a spec can
// assert the task ran exactly once per mount.
export const visibleTaskRuns = { count: 0 };

export const LatePanel = component$(() => {
  const status = useSignal("mounted");

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    visibleTaskRuns.count++;
    status.value = "panel-visible";
  });

  return <p data-testid="panel">{status.value}</p>;
});

// The panel (and its visible task) only mounts after an interaction, like a
// modal or popover that opens on click.
export const QwikVisibleTaskLate = component$(() => {
  const open = useSignal(false);

  return (
    <div>
      <button onClick$={() => (open.value = true)}>open</button>
      {open.value && <LatePanel />}
    </div>
  );
});
