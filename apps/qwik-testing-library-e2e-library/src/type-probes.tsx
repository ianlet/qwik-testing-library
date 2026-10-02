// Compile-time checks of the library's public types: `pnpm typecheck` fails if a type
// error expected below disappears, e.g. because a type silently became `any`.
import { component$, Slot } from "@builder.io/qwik";
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

  return value;
}
