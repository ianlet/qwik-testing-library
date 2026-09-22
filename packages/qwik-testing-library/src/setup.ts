// Configure Qwik globals before any Qwik imports
// This must run before qdev.ts loads - beforeAll/beforeEach is too late
//
// Import this in your vitest setup file:
// import "@noma.to/qwik-testing-library/setup";

declare global {
var qTest: boolean;
var qRuntimeQrl: boolean;
var qDev: boolean;
var qInspector: boolean;
var __EXPERIMENTAL__: Record<string, boolean>;
}

// Qwik v2's optimizer replaces build-time `__EXPERIMENTAL__.<feature>` references with true/false
// during its transform. Vitest never runs that transform against the prebuilt core in node_modules,
// so the core (e.g. `error-boundary.js`) reads a raw `__EXPERIMENTAL__` global and throws
// `__EXPERIMENTAL__ is not defined` on import. Define it here (before the core loads, like the other
// globals below) — an empty object means every experimental feature is off, matching a default build.
globalThis.__EXPERIMENTAL__ = globalThis.__EXPERIMENTAL__ ?? {};

// Qwik v2 branches its internal DOM operations on `qTest`: when `true`, it reads
// and writes through the container's own document (the jsdom/happy-dom document
// under test) instead of a global browser `document`. This MUST be `true` for
// rendering to land in the test DOM — with `false`, render() completes but the
// container stays empty.
globalThis.qTest = true;
// Allows `$()` to create runtime QRLs (used by @noma.to/qwik-mock's `mock$`).
globalThis.qRuntimeQrl = true;
globalThis.qDev = true;

// Export to mark this as a module (required for declare global)
// Named export prevents tree-shaking
export const __qwikSetupComplete = true;
