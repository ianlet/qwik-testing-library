import { $, type QRL, implicit$FirstArg } from "@builder.io/qwik";
import { type Mock, vi } from "vitest";

/**
 * @experimental
 *
 * Create a QRL mock that can be used in tests to verify interactions.
 *
 * As Qwik is an async framework, you need to `resolve()` the mock before making your verifications.
 * And remember to clear the mocks before each test to start with a clean slate!
 *
 * @example
 * ```tsx
 * describe('<MyButton />', () => {
 *   beforeEach(() => {
 *     clearAllMocks();
 *   });
 *
 *   it('should call onClick$', async () => {
 *     const onClickMock = mock$();
 *     await render(<MyButton onClick$={onClickMock} />);
 *
 *     await userEvent.click(screen.getByRole('button'));
 *
 *     await waitFor(() => expect(onClickMock.resolve()).resolves.toHaveBeenCalled());
 *   });
 * });
 * ```
 */
export const mockQrl = (_callbackQrl: QRL<(...args: any[]) => any>): QRL<Mock> => {
  return $(vi.fn());
};

export const mock$ = implicit$FirstArg(mockQrl);

/**
 * Will call `.mockClear()` on all spies. This will clear mock history, but not reset its implementation to the
 * default one.
 */
export function clearAllMocks() {
  vi.clearAllMocks();
}
