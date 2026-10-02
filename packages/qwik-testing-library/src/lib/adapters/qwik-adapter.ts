import type { JSXOutput } from "@builder.io/qwik";
import type { RenderOptions } from "../types";

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
