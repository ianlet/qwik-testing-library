import type { JSXOutput as QwikJSXOutput } from "@qwik.dev/core";
import type { Mount } from "./qwik-adapter";

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

export const mount: Mount = async (container, ui, { serverData }) => {
  const { render, getPlatform, setPlatform } =
    await import("@qwik.dev/core/internal");
  const { getQwikLoaderScript } = await import("@qwik.dev/core/server");

  // Qwik detects the browser by checking that HTMLElement is native, which a test DOM isn't.
  setPlatform({ ...getPlatform(), isServer: false });
  injectQwikLoader(container.ownerDocument, getQwikLoaderScript());
  const { cleanup } = await render(container, ui as QwikJSXOutput, {
    serverData,
  });

  return {
    unmount: () => {
      cleanup();
      // Tears the container down so Qwik can render into the same element again.
      (container as QwikContainerElement).qDestroy?.();
    },
  };
};

type QwikContainerElement = HTMLElement & { qDestroy?: () => void };
