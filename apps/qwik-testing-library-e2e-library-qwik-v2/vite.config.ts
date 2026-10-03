import { defineConfig } from "vitest/config";
import { qwikVite } from "@qwik.dev/core/optimizer";

// Runs the specs shared with Qwik v1, plus the Qwik v2-only specs in ./src.
// qwikVite resolves the shared specs' @builder.io/qwik imports to @qwik.dev/core.
export default defineConfig({
  plugins: [qwikVite()],
  test: {
    // Support both jsdom and happy-dom via TEST_DOM env variable
    environment: process.env.TEST_DOM || "happy-dom",
    include: [
      "src/**/*.spec.tsx",
      "../qwik-testing-library-e2e-library/src/**/*.spec.tsx",
    ],
    setupFiles: [
      "@noma.to/qwik-testing-library/setup/qwik-v2",
      "./vitest.setup.ts",
    ],
    globals: true,
  },
});
