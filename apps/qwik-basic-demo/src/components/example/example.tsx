import {
  $,
  component$,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";

export const ExampleTest = component$((props: { flag: boolean }) => {
  const counter = useSignal(0);

  const handleClick = $(() => {
    console.log("COUNTER CLICK");
    counter.value++;
  });

  useTask$(({ track }) => {
    track(counter);
    console.log("COUNTER", counter.value);
  });

  return (
    <div>
      <span>Count:{counter.value}</span>
      <div class="icon">Flag: {props.flag ? "⭐" : "💣"}</div>
      <button class="btn-counter" onClick$={handleClick}>
        Increment counter
      </button>
    </div>
  );
});
