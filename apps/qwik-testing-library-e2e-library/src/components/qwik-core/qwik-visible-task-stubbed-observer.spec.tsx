import { render, screen } from "@noma.to/qwik-testing-library";
import { LatePanel } from "./qwik-visible-task-late";

// Kept in its own file so the stub is in place before the first render of the test window.
describe("useVisibleTask$ with a stubbed IntersectionObserver", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("still runs the visible task", async () => {
    await render(<LatePanel />);

    expect(await screen.findByText("panel-visible")).toBeInTheDocument();
  });
});
