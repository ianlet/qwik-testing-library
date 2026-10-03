// Compile-time checks of the library's public types: `pnpm typecheck` fails if a type
// error expected below disappears, e.g. because a type silently became `any`.
import { component$, Slot, type QRL } from "@builder.io/qwik";
import { mock$ } from "@noma.to/qwik-mock";
import { render, renderHook } from "@noma.to/qwik-testing-library";

const Wrapper = component$(() => <Slot />);

export async function typeProbes() {
  await render(<Wrapper />, { wrapper: Wrapper, serverData: { locale: "en" } });
  const { result } = await renderHook(() => 1, { wrapper: Wrapper });
  const value: number = result;

  // @ts-expect-error only JSX can be rendered
  await render(new Date());
  // @ts-expect-error wrapper must be a component
  await render(<Wrapper />, { wrapper: 42 });
  // @ts-expect-error serverData must be an object
  await render(<Wrapper />, { serverData: 42 });

  const onClick = mock$<(count: number) => void>();
  const onClickProp: QRL<(count: number) => void> = onClick;
  const calls: [count: number][] = onClick.mock.calls;
  // @ts-expect-error a mock returns what its implementation returns
  const onChange: QRL<() => string> = mock$(() => 1);

  return [value, onClickProp, calls, onChange];
}
