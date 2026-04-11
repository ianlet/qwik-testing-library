import type {
  BoundFunctions,
  prettyFormat,
  Queries,
} from "@testing-library/dom";
import { queries } from "@testing-library/dom";
import type { Component, RenderOptions as QwikRenderOptions } from "@builder.io/qwik";

export interface RenderOptions extends QwikRenderOptions {
  container?: HTMLElement;
  baseElement?: HTMLElement;
  queries?: Queries & typeof queries;
  wrapper?: Component;
}

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

export type RenderHookOptions = Pick<RenderOptions, 'wrapper'>;

export interface RenderHookResult<Result> {
  result: Result;
  unmount: () => void;
}
