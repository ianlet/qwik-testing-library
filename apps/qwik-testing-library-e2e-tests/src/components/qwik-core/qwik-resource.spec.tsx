import { render, screen, waitFor } from "@noma.to/qwik-testing-library";
import { QwikResource } from "./qwik-resource";
import { userEvent } from "@testing-library/user-event";

describe("<QwikResource />", () => {
  it("should render the resource", async () => {
    await render(<QwikResource />);

    await waitFor(() =>
      expect(screen.getByText("resource-0")).toBeInTheDocument(),
    );
  });

  describe("on tracked value update", () => {
    it("should render updated resource value", async () => {
      const user = userEvent.setup();
      await render(<QwikResource />);

      const button = screen.getByRole("button", { name: "update" });
      await user.click(button);

      await waitFor(() =>
        expect(screen.getByText("resource-1")).toBeInTheDocument(),
      );
    });
  });
});
