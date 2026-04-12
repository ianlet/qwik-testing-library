import { renderHook, waitFor } from "@noma.to/qwik-testing-library";
import {
  component$,
  Slot,
  useContextProvider,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import { useCounter } from "./use-counter";
import { useStoreValue } from "./use-store-value";
import { useDoubled } from "./use-doubled";
import { useDerived } from "./use-derived";
import { ThemeContext, useTheme } from "./use-theme";

describe("renderHook", () => {
  it("should return the hook result and unmount function", async () => {
    function useSetup() {
      return useSignal(0);
    }

    const { result, unmount } = await renderHook(useSetup);

    expect(result.value).toBe(0);
    expect(unmount).toBeTypeOf("function");
  });

  it("should return a reactive result", async () => {
    const { result } = await renderHook(useCounter);

    await result.increment$();

    expect(result.count.value).toBe(1);
  });

  it("should provide context via wrapper", async () => {
    const ThemeProvider = component$(() => {
      useContextProvider(ThemeContext, useStore({ mode: "dark" }));
      return <Slot />;
    });

    const { result } = await renderHook(useTheme, {
      wrapper: ThemeProvider,
    });

    expect(result.mode).toBe("dark");
  });

  describe("works with common hook patterns", () => {
    it("store-based hook", async () => {
      function useSetup() {
        return useStoreValue({ first: "foo", second: "bar" });
      }

      const { result } = await renderHook(useSetup);

      expect(result.first).toBe("foo");

      result.first = "baz";

      expect(result.first).toBe("baz");
    });

    it("computed-based hook", async () => {
      function useCounterWithDoubled() {
        const count = useSignal(1);
        const doubled = useDoubled(count);
        return { count, doubled };
      }

      const { result } = await renderHook(useCounterWithDoubled);

      expect(result.doubled.value).toBe(2);

      result.count.value = 5;

      await waitFor(() => expect(result.doubled.value).toBe(10));
    });

    it("task-based hook", async () => {
      function useInputWithDerived() {
        const input = useSignal(0);
        const derived = useDerived(input);
        return { input, derived };
      }

      const { result } = await renderHook(useInputWithDerived);

      expect(result.derived.value).toBe("derived-0");

      result.input.value = 42;

      await waitFor(() => expect(result.derived.value).toBe("derived-42"));
    });
  });
});
