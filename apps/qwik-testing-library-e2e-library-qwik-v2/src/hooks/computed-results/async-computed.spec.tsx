import { renderHook } from "@noma.to/qwik-testing-library";
import { useSignal } from "@qwik.dev/core";
import { useAsyncDoubled } from "./use-async-doubled";

it("should resolve async computed signals returned by the hook", async () => {
  function useCounterWithDoubled() {
    const count = useSignal(1);
    const doubled = useAsyncDoubled(count);
    return { count, doubled };
  }

  const { result } = await renderHook(useCounterWithDoubled);

  expect(result.doubled.value).toBe(2);
});
