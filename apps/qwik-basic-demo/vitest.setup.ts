import { beforeAll, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

// This has to run before qdev.ts loads. `beforeAll` is too late
globalThis.qTest = false;
globalThis.qRuntimeQrl = true;
globalThis.qDev = true;
globalThis.qInspector = false;

beforeAll(async () => {
  const { setPlatform } = await import("@builder.io/qwik");
  const { getTestPlatform } = await import("@noma.to/qwik-testing-library");

  setPlatform(getTestPlatform());
});

afterEach(async () => {
  const { cleanup } = await import("@noma.to/qwik-testing-library");

  cleanup();
});
