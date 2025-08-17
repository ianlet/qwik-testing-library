import type {
  BoundFunctions,
  prettyFormat,
  Queries,
} from "@testing-library/dom";
import { queries } from "@testing-library/dom";
import type { Component, RenderOptions } from "@builder.io/qwik";

export interface Options extends RenderOptions {
  container?: HTMLElement;
  baseElement?: HTMLElement;
  queries?: Queries & typeof queries;
  wrapper?: Component;
  mode?: RenderMode;
}

export type RenderMode = "ssr" | "csr";

export type DebugFn = (
  baseElement?: HTMLElement | HTMLElement[],
  maxLength?: number,
  options?: prettyFormat.OptionsReceived,
) => void;

export type Result = BoundFunctions<typeof queries> & {
  asFragment: () => DocumentFragment;
  container: HTMLElement;
  baseElement: HTMLElement;
  debug: DebugFn;
  unmount: () => void;
};

export type ComponentRef = {
  container: HTMLElement;
  componentCleanup: () => void;
};
