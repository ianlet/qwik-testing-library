import type {
  BoundFunctions,
  prettyFormat,
  Queries,
} from "@testing-library/dom";
import { queries } from "@testing-library/dom";
// Structural equivalents of the Qwik types this library accepts, so its declarations
// stay valid whichever Qwik version is installed.
type JSXNode = { type: unknown; props: unknown; key: unknown };
export type JSXOutput = JSXNode | string | number | boolean | null | undefined | JSXOutput[];
export type Component = (props: any, ...rest: any[]) => JSXOutput;

export interface RenderOptions {
  serverData?: Record<string, any>;
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
  unmount: () => void;
};

export type RenderHookOptions = Pick<RenderOptions, 'wrapper'>;

export interface RenderHookResult<Result> {
  result: Result;
  unmount: () => void;
}
