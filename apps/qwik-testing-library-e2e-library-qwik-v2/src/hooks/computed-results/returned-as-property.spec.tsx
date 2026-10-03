import { renderHook } from "@noma.to/qwik-testing-library";
import { useSignal } from "@qwik.dev/core";
import { useSlowlyDoubled } from "./use-slowly-doubled";

it("should resolve computed signals returned as properties", async () => {
  function useCounterWithDoubled() {
    const count = useSignal(1);
    return { count, doubled: useSlowlyDoubled(count) };
  }

  const { result } = await renderHook(useCounterWithDoubled);

  expect(result.doubled.value).toBe(2);
});
