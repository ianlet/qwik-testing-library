import { renderHook } from "@noma.to/qwik-testing-library";
import { useComputed$, useSignal } from "@qwik.dev/core";

it("should surface computed errors when the value is read", async () => {
  function useFailingComputed() {
    const count = useSignal(1);
    const failing = useComputed$(() => {
      if (count.value > 0) {
        throw new Error("boom");
      }
      return count.value;
    });
    return { failing };
  }

  const { result } = await renderHook(useFailingComputed);

  expect(() => result.failing.value).toThrow("boom");
});
