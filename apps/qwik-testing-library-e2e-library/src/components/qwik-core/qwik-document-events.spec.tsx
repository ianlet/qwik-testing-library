import { render, screen } from "@noma.to/qwik-testing-library";
import { userEvent } from "@testing-library/user-event";
import { QwikDocumentEvents } from "./qwik-document-events";

describe("<QwikDocumentEvents />", () => {
  it("should handle a document keydown right after render", async () => {
    const user = userEvent.setup();
    await render(<QwikDocumentEvents />);

    await user.keyboard("{Escape}");

    expect(await screen.findByText("closed")).toBeInTheDocument();
  });

  it("should handle a document click right after render", async () => {
    const user = userEvent.setup();
    await render(<QwikDocumentEvents />);

    await user.click(screen.getByRole("button", { name: "outside" }));

    expect(await screen.findByText("closed")).toBeInTheDocument();
  });

  it("should ignore a click inside", async () => {
    const user = userEvent.setup();
    await render(<QwikDocumentEvents />);

    await user.click(screen.getByText("open"));

    expect(screen.getByText("open")).toBeInTheDocument();
  });
});
