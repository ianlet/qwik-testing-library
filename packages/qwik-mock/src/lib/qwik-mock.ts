import { $ } from "@builder.io/qwik";
import { type Mock, vi } from "vitest";

type Fn = (...args: any[]) => any;

// Structural copy of Qwik's QRL type, so these declarations don't depend on the installed
// Qwik version. Qwik v1 and v2 declare the same shape, except that v2 makes `__brand__QRL__` and
// `dev` optional: keeping them required makes a mock fit the callback props of both versions.
type QRL<T extends Fn> = {
  __qwik_serializable__?: any;
  __brand__QRL__: T;
  resolve(): Promise<T>;
  resolved: undefined | T;
  getCaptured(): unknown[] | null;
  getSymbol(): string;
  getHash(): string;
  dev: { file: string; lo: number; hi: number } | null;
} & {
  bivarianceHack(...args: Parameters<T>): Promise<Awaited<ReturnType<T>>>;
}["bivarianceHack"];

/**
 * A mock that can be passed as a component callback prop (`onClick$`, `onChange$`, etc.)
 * and asserted on directly with `expect()`.
 */
export type QrlMock<T extends Fn = Fn> = QRL<T> & Mock<T>;

/** @internal Called by the Qwik optimizer — use {@link mock$} instead. */
export function mockQrl<T extends Fn = Fn>(
  implQrl?: Pick<QRL<T>, "resolve" | "resolved">,
): QrlMock<T> {
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
export function mock$<T extends Fn = Fn>(impl?: T): QrlMock<T> {
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
