import { renderHook } from "@noma.to/qwik-testing-library";
import { useSignal } from "@qwik.dev/core";
import { useAsyncDoubled } from "./use-async-doubled";
import { useSlowlyDoubled } from "./use-slowly-doubled";

it("should update computed signals as soon as their dependencies change", async () => {
  function useCounterWithDoubled() {
    const count = useSignal(1);
    return { count, doubled: useSlowlyDoubled(count) };
  }
  const { result } = await renderHook(useCounterWithDoubled);

  result.count.value = 5;

  expect(result.doubled.value).toBe(10);
});

it("should update async computed signals once their promise resolves", async () => {
  function useCounterWithDoubled() {
    const count = useSignal(1);
    return { count, doubled: useAsyncDoubled(count) };
  }
  const { result } = await renderHook(useCounterWithDoubled);

  result.count.value = 5;
  await result.doubled.promise();

  expect(result.doubled.value).toBe(10);
});
