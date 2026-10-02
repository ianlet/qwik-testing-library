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
  let { container, baseElement = container } = options;
  const { wrapper: Wrapper } = options;
  const { queries, serverData } = options;

  if (!baseElement) {
    // Default to document.body instead of documentElement to avoid output of potentially large
    // head elements (such as JSS style blocks) in debug output.
    baseElement = document.body;
  }

  if (!container) {
    container = baseElement.insertBefore(
      document.createElement("host"),
      baseElement.firstChild,
    );
  }

  // Wrap the component under test if a wrapper is provided
  const wrappedUi = !Wrapper ? ui : <Wrapper children={ui} />;

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
  const { component$, noSerialize } = await import("@builder.io/qwik");

  const callbackRef = noSerialize(callback);
  const resultRef = noSerialize({ current: undefined as Result | undefined });

  const TestComponent = component$(() => {
    resultRef!.current = callbackRef!();
    return <></>;
  });

  const { unmount } = await render(<TestComponent />, {
    wrapper: options.wrapper,
  });

  return { result: resultRef!.current as Result, unmount };
}

export * from "@testing-library/dom";
export { cleanup, render, renderHook };
