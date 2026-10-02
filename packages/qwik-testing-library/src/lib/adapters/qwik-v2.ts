import type { JSXOutput as QwikJSXOutput } from "@qwik.dev/core";
import type { CorePlatform } from "@qwik.dev/core/internal";
import type { QwikAdapter } from "./qwik-adapter";

// A test DOM has no layout, so a real IntersectionObserver never reports anything as visible.
// The qwikloader gets this one instead, so it starts each `useVisibleTask$` as soon as the
// element is mounted, including elements mounted after an interaction.
class AlwaysVisibleIntersectionObserver {
  constructor(private readonly callback: IntersectionObserverCallback) {}

  observe(target: Element) {
    queueMicrotask(() =>
      this.callback(
        [{ target, isIntersecting: true } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      ),
    );
  }

  unobserve() {}

  disconnect() {}

  takeRecords() {
    return [];
  }
}

function injectQwikLoader(doc: Document, loaderScript: string) {
  new Function("document", "window", "IntersectionObserver", loaderScript)(
    doc,
    doc.defaultView,
    AlwaysVisibleIntersectionObserver,
  );
}

const nextMacrotask = () => new Promise((resolve) => setTimeout(resolve));

async function waitUntilSettled(container: HTMLElement, waitUntilRendered: () => Promise<void>) {
  let mutated: boolean;
  const observer = new MutationObserver(() => (mutated = true));
  observer.observe(container, { subtree: true, childList: true, attributes: true, characterData: true });
  try {
    do {
      mutated = false;
      await waitUntilRendered();
      await nextMacrotask();
    } while (mutated);
  } finally {
    observer.disconnect();
  }
}

export const qwikAdapter: QwikAdapter = {
  async mount(container, ui, { serverData }) {
    const { render, getDomContainer, setPlatform, _waitUntilRendered } = await import("@qwik.dev/core/internal");
    const { getTestPlatform } = await import("@qwik.dev/core/testing");
    const { getQwikLoaderScript } = await import("@qwik.dev/core/server");

    setPlatform(getTestPlatform() as CorePlatform);
    const { cleanup } = await render(container, ui as QwikJSXOutput, { serverData });
    const qContainer = getDomContainer(container);
    const settle = () => waitUntilSettled(container, () => _waitUntilRendered(qContainer));
    await settle();

    injectQwikLoader(container.ownerDocument, getQwikLoaderScript());
    await settle();

    return { unmount: cleanup };
  },
};
