import { render, screen } from "@noma.to/qwik-testing-library";
import { QwikSerialize } from "./qwik-serialize";

describe("<QwikSerialize />", () => {
  it("should render non-serializable value", async () => {
    await render(<QwikSerialize />);

    expect(screen.getByText("no-serialize-foo")).toBeInTheDocument();
  });
});
