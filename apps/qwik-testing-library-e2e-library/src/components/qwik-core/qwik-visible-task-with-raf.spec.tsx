import { render, screen, waitFor } from "@noma.to/qwik-testing-library";
import { QwikVisibleTaskWithRaf } from "./qwik-visible-task-with-raf";

describe("<QwikVisibleTaskWithRaf />", () => {
  it("runs the visible task during render but does not fire the app's requestAnimationFrame", async () => {
    await render(<QwikVisibleTaskWithRaf />);

    // The visible task ran as part of render() (this is what makes render() drain the timer
    // queue in the first place)...
    expect(screen.getByTestId("visible")).toHaveTextContent("visible-ran");

    // ...but the app's rAF-scheduled effect did NOT collapse into render(): the just-mounted
    // state is still observable. Before the fix, draining the visible task also fired this rAF,
    // so this read back "frame-passed".
    expect(screen.getByTestId("frame")).toHaveTextContent("before-frame");
  });

  it("still runs the requestAnimationFrame effect on the next real frame after render", async () => {
    await render(<QwikVisibleTaskWithRaf />);

    expect(screen.getByTestId("frame")).toHaveTextContent("before-frame");

    await waitFor(() =>
      expect(screen.getByTestId("frame")).toHaveTextContent("frame-passed"),
    );
  });
});
