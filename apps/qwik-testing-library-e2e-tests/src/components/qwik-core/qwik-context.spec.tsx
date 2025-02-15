import { render, screen, waitFor } from "@noma.to/qwik-testing-library";
import { userEvent } from "@testing-library/user-event";
import { QwikContext } from "./qwik-context";

describe("<QwikContext />", () => {
  it("should render context value", async () => {
    await render(<QwikContext />);

    expect(screen.getByText("context-foo")).toBeInTheDocument();
  });

  describe("on update", () => {
    it("should render updated context value", async () => {
      const user = userEvent.setup();
      await render(<QwikContext />);

      const button = screen.getByRole("button", { name: "update" });
      await user.click(button);

      await waitFor(() =>
        expect(screen.getByText("context-bar")).toBeInTheDocument(),
      );
    });
  });
});
