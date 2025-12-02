import { getQueriesForElement, prettyDOM } from "@testing-library/dom";
import { JSXOutput } from "@builder.io/qwik";
import { getQwikLoaderScript } from "@builder.io/qwik/server";
import type { ComponentRef, Options, Result } from "./types";

// Patch HTMLTemplateElement.childNodes for happy-dom compatibility
//
// Qwik's VirtualElementImpl uses a <template> element as temporary storage for detached content.
// It calls `template.insertBefore(node)` to store nodes and reads them back via `template.childNodes`.
//
// In real browsers and jsdom, `insertBefore` on a template adds direct children.
// However, happy-dom redirects insertions to `template.content`, leaving `childNodes` empty.
//
// This patch makes `template.childNodes` return `template.content.childNodes` for happy-dom.
if (typeof HTMLTemplateElement !== "undefined") {
  // Detect if this DOM implementation needs the patch by testing behavior
  const testTemplate = document.createElement("template");
  const testNode = document.createComment("test");
  testTemplate.insertBefore(testNode, null);
  const needsPatch = testTemplate.childNodes.length === 0;
  testNode.remove();

  if (needsPatch) {
    Object.defineProperty(HTMLTemplateElement.prototype, "childNodes", {
      get() {
        return this.content.childNodes;
      },
    });
  }
}

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

  // Wrap the component under test if a wrapper is provided
  const wrappedUi = !Wrapper ? ui : <Wrapper children={ui} />;

  // Load the Qwik loader into the target document
  const doc = baseElement.ownerDocument;
  const win = doc.defaultView;
  new Function("document", "window", getQwikLoaderScript())(doc, win);

  const { cleanup } = await qwik.render(container, wrappedUi, { serverData });
  mountedContainers.add({ container, componentCleanup: cleanup });

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

export * from "@testing-library/dom";
export { cleanup, render };
