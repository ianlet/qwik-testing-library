// Configure Qwik globals before any Qwik imports
// This must run before qdev.ts loads - beforeAll/beforeEach is too late
//
// Import this in your vitest setup file:
// import "@noma.to/qwik-testing-library/setup/qwik-v2";

declare global {
var qTest: boolean;
var qRuntimeQrl: boolean;
var qDev: boolean;
var qInspector: boolean;
}

globalThis.qTest = true; // Makes Qwik render through the container's document instead of the global one
globalThis.qRuntimeQrl = true;
globalThis.qDev = true;
globalThis.qInspector = false;

// Loading @qwik.dev/core/testing takes about two seconds per test file. Preloading it here keeps
// that cost out of the first test's timeout.
if (typeof beforeAll === "function") {
  beforeAll(() => import("@qwik.dev/core/testing"));
}

// Export to mark this as a module (required for declare global)
// Named export prevents tree-shaking
export const __qwikSetupComplete = true;
