import { render, screen, waitFor } from "@noma.to/qwik-testing-library";
import { QwikTask } from "./qwik-task";
import { userEvent } from "@testing-library/user-event";

describe("<QwikTask />", () => {
  it("should render value from task", async () => {
    await render(<QwikTask />);

    expect(screen.getByText("foo-0")).toBeInTheDocument();
  });

  describe("on update", () => {
    it("should render value updated from task", async () => {
      const user = userEvent.setup();
      await render(<QwikTask />);

      const button = screen.getByRole("button", { name: "update" });
      await user.click(button);

      await waitFor(() =>
        expect(screen.getByText("foo-1")).toBeInTheDocument(),
      );
    });
  });
});
