import { createContextId, useContext } from "@qwik.dev/core";

export const ThemeContext = createContextId<{ mode: string }>("theme");

export function useTheme() {
  return useContext(ThemeContext);
}
