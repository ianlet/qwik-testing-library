import {
  clearAllMocks,
  mock$,
  render,
  screen,
  waitFor,
} from "@noma.to/qwik-testing-library";
import { Counter } from "./counter";
import { userEvent } from "@testing-library/user-event";

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
      await render(<Counter onChange$={onChangeMock} />);

      const incrementBtn = screen.getByRole("button", { name: "Increment" });
      const user = userEvent.setup();
      await user.click(incrementBtn);

      await waitFor(() =>
        expect(screen.getByText("Counter: 1")).toBeInTheDocument(),
      );
    });

    it("should call onChange$", async () => {
      await render(<Counter onChange$={onChangeMock} />);

      const incrementBtn = screen.getByRole("button", { name: "Increment" });
      const user = userEvent.setup();
      await user.click(incrementBtn);

      await waitFor(() =>
        expect(onChangeMock.resolve()).resolves.toHaveBeenCalledWith(1),
      );
    });
  });

  describe("on decrement", () => {
    it("should decrease by 1", async () => {
      await render(<Counter onChange$={onChangeMock} />);

      const decrementBtn = screen.getByRole("button", { name: "Decrement" });
      const user = userEvent.setup();
      await user.click(decrementBtn);

      await waitFor(() =>
        expect(screen.getByText("Counter: -1")).toBeInTheDocument(),
      );
    });

    it("should call onChange$", async () => {
      await render(<Counter onChange$={onChangeMock} />);

      const decrementBtn = screen.getByRole("button", { name: "Decrement" });
      const user = userEvent.setup();
      await user.click(decrementBtn);

      await waitFor(() =>
        expect(onChangeMock.resolve()).resolves.toHaveBeenCalledWith(-1),
      );
    });
  });
});
