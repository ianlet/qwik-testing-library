import { render, screen, waitFor } from "@noma.to/qwik-testing-library";
import { userEvent } from "@testing-library/user-event";
import {
  LatePanel,
  QwikVisibleTaskLate,
  visibleTaskRuns,
} from "./qwik-visible-task-late";

describe("useVisibleTask$ (default intersection-observer strategy)", () => {
  beforeEach(() => {
    visibleTaskRuns.count = 0;
  });

  it("runs the visible task of an element mounted at render exactly once", async () => {
    await render(<LatePanel />);

    expect(await screen.findByText("panel-visible")).toBeInTheDocument();
    expect(visibleTaskRuns.count).toBe(1);
  });

  it("runs the visible task of an element mounted after an interaction", async () => {
    const user = userEvent.setup();
    await render(<QwikVisibleTaskLate />);

    await user.click(screen.getByRole("button", { name: "open" }));

    await waitFor(() =>
      expect(screen.getByTestId("panel")).toHaveTextContent("panel-visible"),
    );
    expect(visibleTaskRuns.count).toBe(1);
  });
});
