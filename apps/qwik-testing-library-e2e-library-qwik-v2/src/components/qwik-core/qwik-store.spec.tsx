import { render, screen, waitFor } from "@noma.to/qwik-testing-library";
import { QwikStore } from "./qwik-store";
import { userEvent } from "@testing-library/user-event";

describe("<QwikStore />", () => {
  it("should render", async () => {
    await render(<QwikStore />);

    expect(screen.getByText("foo - bar")).toBeInTheDocument();
  });

  describe("on update", () => {
    it("should render updated store value", async () => {
      const user = userEvent.setup();
      await render(<QwikStore />);

      const button = screen.getByRole("button", { name: "update" });
      await user.click(button);

      await waitFor(() =>
        expect(screen.getByText("bar - baz")).toBeInTheDocument(),
      );
    });
  });
});
