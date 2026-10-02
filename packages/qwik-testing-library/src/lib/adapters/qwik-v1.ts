import { getQwikLoaderScript } from "@builder.io/qwik/server";
import type { QwikAdapter } from "./qwik-adapter";

// Qwik's VirtualElementImpl uses a <template> element as temporary storage for detached content.
// It calls `template.insertBefore(node)` to store nodes and reads them back via `template.childNodes`.
//
// In real browsers and jsdom, `insertBefore` on a template adds direct children.
// However, happy-dom redirects insertions to `template.content`, leaving `childNodes` empty.
function patchTemplateChildNodesForHappyDom() {
  if (typeof HTMLTemplateElement === "undefined") return;

  const template = document.createElement("template");
  const probe = document.createComment("probe");
  template.insertBefore(probe, null);
  const storesNodesInContent = template.childNodes.length === 0;
  probe.remove();

  if (storesNodesInContent) {
    Object.defineProperty(HTMLTemplateElement.prototype, "childNodes", {
      get() {
        return this.content.childNodes;
      },
    });
  }
}

function injectQwikLoader(doc: Document) {
  new Function("document", "window", getQwikLoaderScript())(doc, doc.defaultView);
}

patchTemplateChildNodesForHappyDom();

export const qwikV1: QwikAdapter = {
  async mount(container, ui, { serverData }) {
    const { render } = await import("@builder.io/qwik");

    injectQwikLoader(container.ownerDocument);
    const { cleanup } = await render(container, ui, { serverData });

    return { unmount: cleanup };
  },
};
