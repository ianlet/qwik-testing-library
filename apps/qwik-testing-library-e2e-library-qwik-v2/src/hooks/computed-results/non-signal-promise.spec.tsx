import { renderHook } from "@noma.to/qwik-testing-library";

it("should not call promise() on values that are not signals", async () => {
  const promise = vi.fn(() => Promise.resolve());
  function useDeferredRequest() {
    return { request: { promise } };
  }

  await renderHook(useDeferredRequest);

  expect(promise).not.toHaveBeenCalled();
});
