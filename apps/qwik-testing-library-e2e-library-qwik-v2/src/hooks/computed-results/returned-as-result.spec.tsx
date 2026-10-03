import { renderHook } from "@noma.to/qwik-testing-library";
import { useSignal } from "@qwik.dev/core";
import { useSlowlyDoubled } from "./use-slowly-doubled";

it("should resolve a computed signal returned as the result", async () => {
  function useDoubledOne() {
    return useSlowlyDoubled(useSignal(1));
  }

  const { result } = await renderHook(useDoubledOne);

  expect(result.value).toBe(2);
});
