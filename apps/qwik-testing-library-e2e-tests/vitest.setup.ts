import "@testing-library/jest-dom/vitest";
import { beforeEach, vi } from "vitest";

// This has to run before qdev.ts loads. `beforeAll` is too late
globalThis.qTest = false; // Forces Qwik to run as if it was in a Browser
globalThis.qRuntimeQrl = true;
globalThis.qDev = false;
globalThis.qInspector = false;

beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});
