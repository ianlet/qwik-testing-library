import {
  component$,
  noSerialize,
  NoSerialize,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

class MyClass {
  constructor(private _foo: string) {}

  get foo(): string {
    return this._foo;
  }

  set foo(value: string) {
    this._foo = value;
  }
}

export const QwikSerialize = component$(() => {
  const sig = useSignal<NoSerialize<MyClass>>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    sig.value = noSerialize(new MyClass("no-serialize-foo"));
  });

  return <div>{sig.value?.foo}</div>;
});
