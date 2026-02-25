import { $, type QRL } from "@builder.io/qwik";
import { type Mock, vi } from "vitest";

/**
 * A mock that can be passed as a component callback prop (`onClick$`, `onChange$`, etc.)
 * and asserted on directly with `expect()`.
 */
export type QrlMock<
  T extends (...args: any[]) => any = (...args: any[]) => any,
> = QRL<T> & Mock<T>;

/** @internal Called by the Qwik optimizer — use {@link mock$} instead. */
export function mockQrl<
  T extends (...args: any[]) => any = (...args: any[]) => any,
>(implQrl?: QRL<T>): QrlMock<T> {
  const mockFn = vi.fn(implQrl?.resolved);

  // The optimizer may lazy-load the implementation QRL, so .resolved
  // might not be available yet. Resolve it async and set when ready.
  if (implQrl && !mockFn.getMockImplementation()) {
    implQrl
      .resolve()
      .then((impl) => (mockFn as Mock).mockImplementation(impl));
  }

  const qrl = $(mockFn);

  return new Proxy(qrl, {
    get(target, prop, receiver) {
      if (!(prop in target) && prop in mockFn) {
        const value = (mockFn as any)[prop];
        return typeof value === "function" ? value.bind(mockFn) : value;
      }
      return Reflect.get(target, prop, receiver);
    },
    has(target, prop) {
      return Reflect.has(target, prop) || Reflect.has(mockFn, prop);
    },
  }) as unknown as QrlMock<T>;
}

/**
 * @experimental
 *
 * Create a mock for a component callback prop (`onClick$`, `onChange$`, etc.).
 *
 * Pass it to a component like any other `$` prop, then assert on it directly —
 * no need to resolve.
 *
 * @param impl - Optional implementation function for the mock.
 *
 * @example
 * ```tsx
 * const onClickMock = mock$();
 * await render(<MyButton onClick$={onClickMock} />);
 *
 * await userEvent.click(screen.getByRole('button'));
 *
 * await waitFor(() => expect(onClickMock).toHaveBeenCalled());
 * ```
 */
export function mock$<
  T extends (...args: any[]) => any = (...args: any[]) => any,
>(impl?: T): QrlMock<T> {
  return mockQrl(impl ? $(impl) : undefined);
}

/**
 * Clear mock history on all mocks created with {@link mock$}.
 * Does not reset their implementation.
 *
 * Typically called in `beforeEach` to start each test with a clean slate.
 */
export function clearAllMocks() {
  vi.clearAllMocks();
}
