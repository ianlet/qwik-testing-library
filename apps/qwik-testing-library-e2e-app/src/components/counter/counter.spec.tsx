import { render, screen } from "@noma.to/qwik-testing-library";
import { userEvent } from "@testing-library/user-event";
import { Counter } from "./counter";

describe("Counter", () => {
  it("should render with initial count", async () => {
    await render(<Counter />);

    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });

  it("should increment on click", async () => {
    const user = userEvent.setup();
    await render(<Counter />);

    await user.click(screen.getByRole("button", { name: "Increment" }));

    expect(await screen.findByText("Count: 1")).toBeInTheDocument();
  });
});
