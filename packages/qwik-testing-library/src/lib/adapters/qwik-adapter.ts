import type { JSXOutput, RenderOptions } from "../types";

export interface MountedComponent {
  unmount: () => void;
}

export interface QwikAdapter {
  mount(
    container: HTMLElement,
    ui: JSXOutput,
    options: Pick<RenderOptions, "serverData">,
  ): Promise<MountedComponent>;
}

export async function loadQwikAdapter(): Promise<QwikAdapter> {
  const { version } = await import("@builder.io/qwik");
  const { qwikAdapter } = version.startsWith("1.")
    ? await import("./qwik-v1")
    : await import("./qwik-v2");
  return qwikAdapter;
}
