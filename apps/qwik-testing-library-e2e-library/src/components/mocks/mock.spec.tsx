import { render, screen, waitFor } from "@noma.to/qwik-testing-library";
import { clearAllMocks, mock$ } from "@noma.to/qwik-mock";
import { userEvent } from "@testing-library/user-event";
import { DualAction } from "./dual-action";

describe("mock$", () => {
  beforeEach(() => {
    clearAllMocks();
  });

  describe("independent mock identity", () => {
    it("should resolve to different vi.fn() instances", async () => {
      const mockA = mock$(() => {});
      const mockB = mock$(() => {});

      const resolvedA = await mockA.resolve();
      const resolvedB = await mockB.resolve();

      expect(resolvedA).not.toBe(resolvedB);
    });

    it("should track calls independently when using multiple mocks", async () => {
      const onPrimaryMock = mock$(() => {});
      const onSecondaryMock = mock$(() => {});
      const user = userEvent.setup();

      await render(
        <DualAction
          onPrimary$={onPrimaryMock}
          onSecondary$={onSecondaryMock}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Primary" }));

      await waitFor(() =>
        expect(onPrimaryMock.resolve()).resolves.toHaveBeenCalledTimes(1),
      );
      expect(await onSecondaryMock.resolve()).not.toHaveBeenCalled();
    });
  });
});
