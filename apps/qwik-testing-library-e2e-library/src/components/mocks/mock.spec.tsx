import { render, screen, waitFor } from "@noma.to/qwik-testing-library";
import { clearAllMocks, mock$ } from "@noma.to/qwik-mock";
import { userEvent } from "@testing-library/user-event";
import { DualAction } from "./dual-action";
import { SubmitForm } from "./submit-form";

describe("mock$", () => {
  beforeEach(() => {
    clearAllMocks();
  });

  describe("custom implementation", () => {
    it("should use the provided implementation", async () => {
      const onSubmitMock = mock$(() => "success");
      const user = userEvent.setup();

      await render(<SubmitForm onSubmit$={onSubmitMock} />);
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(await screen.findByText("success")).toBeInTheDocument();
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("independent mock identity", () => {
    it("should create different mock instances", () => {
      const mockA = mock$();
      const mockB = mock$();

      expect(mockA).not.toBe(mockB);
    });

    it("should track calls independently when using multiple mocks", async () => {
      const onPrimaryMock = mock$();
      const onSecondaryMock = mock$();
      const user = userEvent.setup();

      await render(
        <DualAction
          onPrimary$={onPrimaryMock}
          onSecondary$={onSecondaryMock}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Primary" }));

      await waitFor(() =>
        expect(onPrimaryMock).toHaveBeenCalledTimes(1),
      );
      expect(onSecondaryMock).not.toHaveBeenCalled();
    });
  });
});
