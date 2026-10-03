import type { ComponentRef, JSXOutput, RenderOptions } from "../types";

export type Mount = (
  container: HTMLElement,
  ui: JSXOutput,
  options: Pick<RenderOptions, "serverData">,
) => Promise<Pick<ComponentRef, "unmount">>;

export async function loadMount(): Promise<Mount> {
  const { version } = await import("@builder.io/qwik");
  const { mount } = version.startsWith("1.")
    ? await import("./qwik-v1")
    : await import("./qwik-v2");
  return mount;
}
