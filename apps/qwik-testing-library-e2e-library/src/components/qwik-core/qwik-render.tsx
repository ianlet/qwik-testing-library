import { $, component$, PropsOf, Slot, useSignal } from "@builder.io/qwik";

interface QwikRenderProps extends PropsOf<"div"> {
  myProp?: string;
  items?: string[];
}

export const QwikRender = component$<QwikRenderProps>(
  ({ myProp = "qwik-prop", items = [] }) => {
    const propSig = useSignal(myProp);

    const changePropValue = $(() => {
      propSig.value = "changed-prop";
    });

    return (
      <div>
        <ChildComponent myProp={propSig.value} />

        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <button onClick$={changePropValue}>change prop</button>
      </div>
    );
  },
);

const ChildComponent = component$<QwikRenderProps>(({ myProp }) => {
  return (
    <>
      <div>{myProp}</div>
      <div>
        <Slot name="slot-name" />
      </div>
      <div>
        <Slot />
      </div>
    </>
  );
});
