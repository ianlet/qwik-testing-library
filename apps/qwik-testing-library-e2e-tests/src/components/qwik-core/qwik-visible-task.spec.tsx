import { render, screen, waitFor } from "@noma.to/qwik-testing-library";
import { userEvent } from "@testing-library/user-event";
import { QwikVisibleTask } from "./qwik-visible-task";

describe("<QwikVisibleTask />", () => {
  it("should render value from visible task", async () => {
    await render(<QwikVisibleTask />);

    expect(screen.getByText("foo-0")).toBeInTheDocument();
  });

  describe("on update", () => {
    it("should render value updated from visible task", async () => {
      const user = userEvent.setup();
      await render(<QwikVisibleTask />);

      const button = screen.getByRole("button", { name: "update" });
      await user.click(button);

      await waitFor(() =>
        expect(screen.getByText("foo-1")).toBeInTheDocument(),
      );
    });
  });
});
