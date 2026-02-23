import { QwikRender } from "./qwik-render";
import { render, screen } from "@noma.to/qwik-testing-library";
import { userEvent } from "@testing-library/user-event";

describe("<QwikRender />", () => {
  const aProp = "my-prop";
  const initialProp = "qwik-prop";
  const changedProp = "changed-prop";

  it("should render prop value", async () => {
    await render(<QwikRender myProp={aProp} />);

    expect(screen.getByText(aProp)).toBeInTheDocument();
  });

  describe("when props change", () => {
    it("should re-render", async () => {
      const user = userEvent.setup();
      await render(<QwikRender myProp={initialProp} />);

      const changePropBtn = screen.getByRole("button", {
        name: /change prop/,
      });
      await user.click(changePropBtn);

      expect(await screen.findByText(changedProp)).toBeInTheDocument();
    });
  });

  it("should render a list of elements", async () => {
    await render(<QwikRender items={["a", "b", "c"]} />);

    expect(screen.findAllByRole("listitem")).resolves.toHaveLength(3);
  });
});
