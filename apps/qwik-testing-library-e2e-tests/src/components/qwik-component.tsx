import {
  $,
  component$,
  createContextId,
  noSerialize,
  NoSerialize,
  PropsOf,
  QRL,
  Resource,
  Slot,
  useComputed$,
  useContext,
  useContextProvider,
  useResource$,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";

export const MyContext = createContextId<{ item: string }>("my-context");

interface QwikComponentProps extends PropsOf<"div"> {
  myProp?: string;
  items?: string[];
  onFirst$?: QRL<() => void>;
  onSecond$?: QRL<() => void>;
}

export const QwikComponent = component$<QwikComponentProps>(
  ({ myProp = "qwik-prop", items = [], onFirst$, onSecond$ }) => {
    const mySig = useSignal("my-signal");
    const propSig = useSignal(myProp);
    const conditionalSig = useSignal(false);

    const myStore = useStore<{ item: string }>({ item: "my-store" });

    const computedTrackedSig = useSignal("computed-value");
    const myComputed = useComputed$(() => computedTrackedSig.value);

    const resourceTrackedSig = useSignal("resource-value");
    const myResource = useResource$(({ track }) => {
      const value = track(resourceTrackedSig);
      return Promise.resolve(value);
    });

    const contextStore = useStore({ item: "context-value" });
    useContextProvider(MyContext, contextStore);

    const trackedSig = useSignal("");
    const taskSig = useSignal("");

    useTask$(({ track }) => {
      taskSig.value = track(trackedSig);
    });

    const nonSerializableSig = useSignal<NoSerialize<MyClass>>();

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      nonSerializableSig.value = noSerialize(
        new MyClass("non-serializable-value"),
      );
    });

    const changePropValue = $(() => {
      propSig.value = "changed-prop";
    });

    const changeSignalValue = $(() => {
      mySig.value = "changed-signal";
    });

    const changeStoreValue = $(() => {
      myStore.item = "changed-store";
    });

    const changeComputedValue = $(() => {
      computedTrackedSig.value = "changed-computed";
    });

    const changeResourceValue = $(() => {
      resourceTrackedSig.value = "changed-resource";
    });

    const changeTrackedValue = $(() => {
      trackedSig.value = "tracked-task-value";
    });

    const changeCondition = $(() => {
      conditionalSig.value = !conditionalSig.value;
    });

    return (
      <div>
        <div>{mySig.value}</div>
        <div>{myStore.item}</div>
        <div>{myComputed.value}</div>
        <div>{trackedSig.value}</div>
        <div>{nonSerializableSig.value?.item}</div>

        <Resource value={myResource} onResolved={(r) => <div>{r}</div>} />
        <ChangeContext />

        <ChildComponent myProp={propSig.value}>
          <span>slot-component</span>
          <span q:slot="slot-name">named-slot-component</span>
        </ChildComponent>

        {conditionalSig.value && <div>conditional-value</div>}

        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <button onClick$={changePropValue}>change prop</button>
        <button onClick$={changeSignalValue}>change signal</button>
        <button onClick$={changeStoreValue}>change store</button>
        <button onClick$={changeComputedValue}>change computed</button>
        <button onClick$={changeResourceValue}>change resource</button>
        <button onClick$={changeTrackedValue}>change tracked</button>
        <button onClick$={changeCondition}>change condition</button>

        <button onClick$={[onFirst$, onSecond$]}>fire events</button>
      </div>
    );
  },
);

const ChildComponent = component$<QwikComponentProps>(({ myProp }) => {
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

const ChangeContext = component$(() => {
  const ctx = useContext(MyContext);

  return (
    <div>
      {ctx.item}
      <button onClick$={$(() => (ctx.item = "changed-context"))}>
        change context
      </button>
    </div>
  );
});

class MyClass {
  constructor(private _item: string) {}

  get item() {
    return this._item;
  }
}
