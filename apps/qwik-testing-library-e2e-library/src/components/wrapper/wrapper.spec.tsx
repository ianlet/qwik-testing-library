import { render, screen } from "@noma.to/qwik-testing-library";
import { component$, Slot } from "@qwik.dev/core";

const MyComponent = component$(() => <div>my-component</div>);

const Wrapper = component$(() => {
  return (
    <div data-testid="wrapper">
      <Slot />
    </div>
  );
});

describe("Wrapper", () => {
  it("should wrap my component inside the wrapper", async () => {
    await render(<MyComponent />, { wrapper: Wrapper });

    expect(screen.getByTestId("wrapper")).toHaveTextContent("my-component");
  });
});
