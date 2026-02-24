import { createContextId, useContext } from "@builder.io/qwik";

export const ThemeContext = createContextId<{ mode: string }>("theme");

export function useTheme() {
  return useContext(ThemeContext);
}
