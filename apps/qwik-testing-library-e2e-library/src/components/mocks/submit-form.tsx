import { $, component$, type QRL, useSignal } from "@builder.io/qwik";

interface SubmitFormProps {
  onSubmit$: QRL<() => string>;
}

export const SubmitForm = component$<SubmitFormProps>(({ onSubmit$ }) => {
  const result = useSignal("");

  const handleSubmit = $(async () => {
    result.value = await onSubmit$();
  });

  return (
    <div>
      <button onClick$={handleSubmit}>Submit</button>
      {result.value && <p>{result.value}</p>}
    </div>
  );
});
