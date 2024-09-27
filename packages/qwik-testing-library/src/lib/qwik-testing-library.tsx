import { getQueriesForElement, prettyDOM } from "@testing-library/dom";
import { JSXOutput } from "@builder.io/qwik";
import type { ComponentRef, Options, Result } from "./types";
import { qwikLoader } from "./qwikloader";

const mountedContainers = new Set<ComponentRef>();

async function render(ui: JSXOutput, options: Options = {}): Promise<Result> {
  const qwik = await import("@builder.io/qwik");

  let { container, baseElement = container, wrapper: Wrapper } = options;
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

  const wrappedUi = !Wrapper ? ui : <Wrapper children={ui} />;

  const { cleanup } = await qwik.render(container, wrappedUi, { serverData });

  qwikLoader(baseElement.ownerDocument);

  mountedContainers.add({ container, componentCleanup: cleanup });

  const queryHelpers = getQueriesForElement(container, queries);

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
    unmount: cleanup,
    ...queryHelpers,
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

export * from "@testing-library/dom";
export { cleanup, render };
