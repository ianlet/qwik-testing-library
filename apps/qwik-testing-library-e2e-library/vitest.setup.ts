import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

beforeEach(() => {
  // Qwik instantiates `new IntersectionObserver()` for visible tasks. The testing
  // library runs `useVisibleTask$` directly, so a no-op observer is enough here.
  // (Vitest 4 no longer allows `mockReturnValue` on a mock invoked with `new`, so
  // provide a class.)
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
});
