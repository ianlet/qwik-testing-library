import { render, screen } from "@noma.to/qwik-testing-library";
import { userEvent } from "@testing-library/user-event";
import { component$, useTask$ } from "@qwik.dev/core";

const ThrowsOnRender = component$(() => {
  throw new Error("render failed");
});

const ThrowsInTask = component$(() => {
  useTask$(() => {
    throw new Error("task failed");
  });
  return <p>task</p>;
});

const ThrowsOnClick = component$(() => (
  <button
    onClick$={() => {
      throw new Error("click failed");
    }}
  >
    click
  </button>
));

// Qwik v2 doesn't report errors when running under test, so neither can render.
// These specs fail once it does, as a reminder to surface those errors and update the README.
describe("errors with Qwik v2", () => {
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error");
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it("are not reported when a component throws while rendering", async () => {
    await expect(render(<ThrowsOnRender />)).resolves.toBeDefined();

    expect(consoleError).not.toHaveBeenCalled();
  });

  it("are not reported when a task throws", async () => {
    await expect(render(<ThrowsInTask />)).resolves.toBeDefined();

    expect(consoleError).not.toHaveBeenCalled();
  });

  it("are not reported when an event handler throws", async () => {
    await render(<ThrowsOnClick />);

    await userEvent.click(screen.getByRole("button"));

    expect(consoleError).not.toHaveBeenCalled();
  });
});
