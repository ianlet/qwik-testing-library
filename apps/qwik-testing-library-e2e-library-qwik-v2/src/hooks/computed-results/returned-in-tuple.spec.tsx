import { renderHook } from "@noma.to/qwik-testing-library";
import { useSignal } from "@qwik.dev/core";
import { useSlowlyDoubled } from "./use-slowly-doubled";

it("should resolve computed signals returned in a tuple", async () => {
  function useCounterWithDoubled() {
    const count = useSignal(1);
    const doubled = useSlowlyDoubled(count);
    return [count, doubled] as const;
  }

  const { result } = await renderHook(useCounterWithDoubled);

  expect(result[1].value).toBe(2);
});
