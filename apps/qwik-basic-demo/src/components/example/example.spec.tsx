import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@noma.to/qwik-testing-library";

import { ExampleTest } from "./example";

describe("<ExampleTest />", () => {
  it(`[ExampleTest Component]: Should render increment button`, async () => {
    await render(<ExampleTest flag={true} />);

    expect(
      screen.getByRole("button", { name: "Increment counter" }),
    ).toBeInTheDocument();
  });

  it(`[ExampleTest Component]: Should render ⭐`, async () => {
    await render(<ExampleTest flag={true} />);

    expect(screen.getByText(/⭐/)).toBeInTheDocument();
  });

  it(`[ExampleTest Component]: Should render 💣`, async () => {
    await render(<ExampleTest flag={false} />);

    expect(screen.getByText(/💣/)).toBeInTheDocument();
  });

  it(`[ExampleTest Component]: Click counter +1`, async () => {
    await render(<ExampleTest flag={true} />);

    const button = screen.getByRole("button", { name: "Increment counter" });
    await userEvent.click(button);

    await waitFor(async () =>
      expect(screen.getByText("Count:1")).toBeInTheDocument(),
    );
  });
});
