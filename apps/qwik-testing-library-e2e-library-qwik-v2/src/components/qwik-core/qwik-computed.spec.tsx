import { render, screen, waitFor } from "@noma.to/qwik-testing-library";
import { QwikComputed } from "./qwik-computed";
import { userEvent } from "@testing-library/user-event";

describe("<QwikComputed />", () => {
  it("should render computed value", async () => {
    await render(<QwikComputed />);

    expect(screen.getByText("computed-value-0")).toBeInTheDocument();
  });

  describe("on tracked value update", () => {
    it("should render updated computed value", async () => {
      const user = userEvent.setup();
      await render(<QwikComputed />);

      const button = screen.getByRole("button", { name: "update" });
      await user.click(button);

      await waitFor(() =>
        expect(screen.getByText("computed-value-1")).toBeInTheDocument(),
      );
    });
  });
});
