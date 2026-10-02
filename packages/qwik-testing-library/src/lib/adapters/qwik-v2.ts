import type { QwikAdapter } from "./qwik-adapter";

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
    const { getTestPlatform, trigger } = await import("@qwik.dev/core/testing");
    const { getQwikLoaderScript } = await import("@qwik.dev/core/server");

    setPlatform(getTestPlatform() as never);
    const { cleanup } = await render(container, ui as never, { serverData });
    const qContainer = getDomContainer(container);
    const settle = () => waitUntilSettled(container, () => _waitUntilRendered(qContainer));
    await settle();

    const doc = container.ownerDocument;
    new Function("document", "window", getQwikLoaderScript())(doc, doc.defaultView);
    await trigger(container, "[q-e\\:qvisible]", "qvisible", {}, { waitForIdle: false });
    await settle();

    return { unmount: cleanup };
  },
};
