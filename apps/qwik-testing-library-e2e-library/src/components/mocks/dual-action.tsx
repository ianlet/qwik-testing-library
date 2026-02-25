import { component$, type QRL } from "@builder.io/qwik";

interface DualActionProps {
  onPrimary$: QRL<() => void>;
  onSecondary$: QRL<() => void>;
}

export const DualAction = component$<DualActionProps>(
  ({ onPrimary$, onSecondary$ }) => {
    return (
      <div>
        <button onClick$={onPrimary$}>Primary</button>
        <button onClick$={onSecondary$}>Secondary</button>
      </div>
    );
  },
);
