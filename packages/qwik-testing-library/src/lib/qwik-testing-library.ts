import { getQueriesForElement, prettyDOM } from "@testing-library/dom";
import type { JSXOutput } from "@builder.io/qwik";
import type {
  ComponentRef,
  RenderOptions,
  RenderHookOptions,
  RenderHookResult,
  Result,
} from "./types";
import { qwikV1 } from "./adapters/qwik-v1";

// if we're running in a test runner that supports afterEach
// then we'll automatically run cleanup afterEach test
// this ensures that tests run in isolation from each other
// if you don't like this, set the QTL_SKIP_AUTO_CLEANUP env variable to 'true'
if (typeof process === "undefined" || !process.env?.QTL_SKIP_AUTO_CLEANUP) {
  if (typeof afterEach === "function") {
    afterEach(() => {
      cleanup();
    });
  }
}

const mountedContainers = new Set<ComponentRef>();

async function render(ui: JSXOutput, options: RenderOptions = {}): Promise<Result> {
  const { jsx } = await import("@builder.io/qwik");

  const { wrapper: Wrapper, queries, serverData } = options;
  // Default to document.body instead of documentElement to avoid output of potentially large
  // head elements (such as JSS style blocks) in debug output.
  const baseElement = options.baseElement ?? options.container ?? document.body;
  const container =
    options.container ??
    baseElement.insertBefore(document.createElement("host"), baseElement.firstChild);

  const wrappedUi = Wrapper ? jsx(Wrapper, { children: ui }) : ui;

  const { unmount } = await qwikV1.mount(container, wrappedUi, { serverData });
  mountedContainers.add({ container, componentCleanup: unmount });

  return {
    container,
    baseElement,
    asFragment: () => {
      if (typeof document.createRange === "function") {
        return document
          .createRange()
          .createContextualFragment(container.innerHTML);
      } else {
        const template = document.createElement("template");
        template.innerHTML = container.innerHTML;
        return template.content;
      }
    },
    debug: (el = baseElement, maxLength, options) =>
      Array.isArray(el)
        ? el.forEach((e) => console.log(prettyDOM(e, maxLength, options)))
        : console.log(
            prettyDOM(el, maxLength, { ...options, filterNode: () => true }),
          ),
    unmount,
    ...getQueriesForElement(container, queries),
  };
}

function cleanupAtContainer(ref: ComponentRef) {
  const { container, componentCleanup } = ref;

  componentCleanup();

  if (container?.parentNode === document.body) {
    document.body.removeChild(container);
  }

  mountedContainers.delete(ref);
}

function cleanup() {
  mountedContainers.forEach(cleanupAtContainer);
}

async function renderHook<Result>(
  callback: () => Result,
  options: RenderHookOptions = {},
): Promise<RenderHookResult<Result>> {
  const { component$, jsx, noSerialize } = await import("@builder.io/qwik");

  const callbackRef = noSerialize(callback);
  const resultRef = noSerialize({ current: undefined as Result | undefined });

  const TestComponent = component$(() => {
    resultRef!.current = callbackRef!();
    return null;
  });

  const { unmount } = await render(jsx(TestComponent, {}), {
    wrapper: options.wrapper,
  });

  return { result: resultRef!.current as Result, unmount };
}

export * from "@testing-library/dom";
export { cleanup, render, renderHook };
