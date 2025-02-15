import { render, screen, waitFor } from "@noma.to/qwik-testing-library";
import { userEvent } from "@testing-library/user-event";
import { QwikSlot } from "./qwik-slot";

describe("<QwikSlot />", () => {
  it("should render slot content", async () => {
    await render(<QwikSlot>default-slot</QwikSlot>);

    expect(screen.getByText("default-slot")).toBeInTheDocument();
  });

  it("should render named slot content", async () => {
    await render(
      <QwikSlot>
        <span q:slot="foo">named-slot</span>
      </QwikSlot>,
    );

    expect(screen.getByText("named-slot")).toBeInTheDocument();
  });

  it("should render conditional slot value", async () => {
    const user = userEvent.setup();
    await render(
      <QwikSlot>
        <button q:slot="conditional">conditional-slot</button>
      </QwikSlot>,
    );

    expect(
      screen.queryByRole("button", { name: "conditional-slot" }),
    ).not.toBeInTheDocument();

    const button = screen.getByRole("button", { name: "update" });
    await user.click(button);

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "conditional-slot" }),
      ).toBeInTheDocument(),
    );
  });
});
