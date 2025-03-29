import { render, screen, waitFor } from "@noma.to/qwik-testing-library";
import { clearAllMocks, mock$ } from "@noma.to/qwik-mock";
import { userEvent } from "@testing-library/user-event";
import { Counter } from "./counter";

describe("<Counter />", () => {
  const onChangeMock = mock$(() => {});

  beforeEach(() => {
    clearAllMocks();
  });

  it("should start at 0 by default", async () => {
    await render(<Counter onChange$={onChangeMock} />);

    expect(screen.getByText("Counter: 0")).toBeInTheDocument();
  });

  describe("on increment", () => {
    it("should increase by 1", async () => {
      const user = userEvent.setup();
      await render(<Counter onChange$={onChangeMock} />);

      const incrementBtn = screen.getByRole("button", { name: "Increment" });
      await user.click(incrementBtn);

      expect(await screen.findByText("Counter: 1")).toBeInTheDocument();
    });

    it("should call onChange$", async () => {
      const user = userEvent.setup();
      await render(<Counter onChange$={onChangeMock} />);

      const incrementBtn = screen.getByRole("button", { name: "Increment" });
      await user.click(incrementBtn);

      await waitFor(() =>
        expect(onChangeMock.resolve()).resolves.toHaveBeenCalledWith(1),
      );
    });
  });

  describe("on decrement", () => {
    it("should decrease by 1", async () => {
      const user = userEvent.setup();
      await render(<Counter onChange$={onChangeMock} />);

      const decrementBtn = screen.getByRole("button", { name: "Decrement" });
      await user.click(decrementBtn);

      expect(await screen.findByText("Counter: -1")).toBeInTheDocument();
    });

    it("should call onChange$", async () => {
      const user = userEvent.setup();
      await render(<Counter onChange$={onChangeMock} />);

      const decrementBtn = screen.getByRole("button", { name: "Decrement" });
      await user.click(decrementBtn);

      await waitFor(() =>
        expect(onChangeMock.resolve()).resolves.toHaveBeenCalledWith(-1),
      );
    });
  });
});
