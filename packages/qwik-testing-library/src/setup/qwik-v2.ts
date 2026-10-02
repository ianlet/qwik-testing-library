// Configure Qwik globals before any Qwik imports
// This must run before qdev.ts loads - beforeAll/beforeEach is too late
//
// Import this in your vitest setup file:
// import "@noma.to/qwik-testing-library/setup/qwik-v2";

declare global {
var qRuntimeQrl: boolean;
var qDev: boolean;
var qInspector: boolean;
}

globalThis.qRuntimeQrl = true; // Allows creating QRLs at runtime, as qwik-mock and renderHook do
globalThis.qDev = true;
globalThis.qInspector = false;

// Export to mark this as a module (required for declare global)
// Named export prevents tree-shaking
export const __qwikSetupComplete = true;
