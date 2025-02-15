import { render, screen, waitFor } from "@noma.to/qwik-testing-library";
import { QwikSignal } from "./qwik-signal";
import { userEvent } from "@testing-library/user-event";

describe("<QwikSignal />", () => {
  it("should render signal value", async () => {
    await render(<QwikSignal />);

    expect(screen.getByText("my-signal")).toBeInTheDocument();
  });

  describe("on update", () => {
    it("should render updated signal value", async () => {
      const user = userEvent.setup();
      await render(<QwikSignal />);

      const button = screen.getByRole("button", { name: "update" });
      await user.click(button);

      await waitFor(() =>
        expect(screen.getByText("updated-signal")).toBeInTheDocument(),
      );
    });
  });
});
