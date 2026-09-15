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
}

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
