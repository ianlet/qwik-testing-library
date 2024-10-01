import { QwikComponent } from "./qwik-component";
import { render, screen, waitFor } from "@noma.to/qwik-testing-library";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

describe("<QwikComponent />", () => {
  const aProp = "my-prop";

  describe("Rendering", () => {
    const initialProp = "qwik-prop";
    const changedProp = "changed-prop";
    const nonSerializableValue = "non-serializable-value";

    it("should render prop value", async () => {
      await render(<QwikComponent myProp={aProp} />);

      expect(screen.getByText(aProp)).toBeInTheDocument();
    });

    describe("when props change", () => {
      it("should re-render", async () => {
        await render(<QwikComponent myProp={initialProp} />);

        const changePropBtn = screen.getByRole("button", {
          name: /change prop/,
        });
        await userEvent.click(changePropBtn);

        await waitFor(() =>
          expect(screen.getByText(changedProp)).toBeInTheDocument(),
        );
      });
    });

    describe("when conditional render changes", () => {
      const conditionalValue = "conditional-value";

      it("should re-render", async () => {
        await render(<QwikComponent />);
        expect(screen.queryByText(conditionalValue)).not.toBeInTheDocument();

        const changeConditionBtn = screen.getByRole("button", {
          name: /change condition/,
        });
        await userEvent.click(changeConditionBtn);

        await waitFor(() =>
          expect(screen.getByText(conditionalValue)).toBeInTheDocument(),
        );
      });
    });

    it("should render a list of elements", async () => {
      await render(<QwikComponent items={["a", "b", "c"]} />);

      expect(screen.findAllByRole("listitem")).resolves.toHaveLength(3);
    });

    it("should render non-serializable items", async () => {
      await render(<QwikComponent />);

      expect(screen.queryByText(nonSerializableValue)).toBeInTheDocument();
    });

    it("should render slot component", async () => {
      await render(<QwikComponent />);

      expect(screen.getByText("slot-component")).toBeInTheDocument();
    });

    it("should render named slot component", async () => {
      await render(<QwikComponent />);

      expect(screen.getByText("named-slot-component")).toBeInTheDocument();
    });
  });

  describe("State", () => {
    describe("Signals", () => {
      const signalValue = "my-signal";
      const changedSignalValue = "changed-signal";

      it("should render signal value", async () => {
        await render(<QwikComponent myProp={aProp} />);

        await waitFor(() =>
          expect(screen.getByText(signalValue)).toBeInTheDocument(),
        );
      });

      describe("when signal changes", () => {
        it("should re-render signal value", async () => {
          await render(<QwikComponent />);

          const changeSignalBtn = screen.getByRole("button", {
            name: /change signal/,
          });
          await userEvent.click(changeSignalBtn);

          await waitFor(() =>
            expect(screen.getByText(changedSignalValue)).toBeInTheDocument(),
          );
        });
      });
    });

    describe("Stores", () => {
      const storeValue = "my-store";
      const changedStoreValue = "changed-store";

      it("should render store value", async () => {
        await render(<QwikComponent />);

        expect(screen.getByText(storeValue)).toBeInTheDocument();
      });

      describe("when store changes", () => {
        it("should re-render store value", async () => {
          await render(<QwikComponent />);

          const changeStoreBtn = screen.getByRole("button", {
            name: /change store/,
          });
          await userEvent.click(changeStoreBtn);

          await waitFor(() =>
            expect(screen.getByText(changedStoreValue)).toBeInTheDocument(),
          );
        });
      });
    });

    describe("Computed", () => {
      const computedValue = "computed-value";
      const changedComputedValue = "changed-computed";

      it("should render computed value", async () => {
        await render(<QwikComponent />);

        expect(screen.getByText(computedValue)).toBeInTheDocument();
      });

      describe("when computed changes", () => {
        it("should re-render computed value", async () => {
          await render(<QwikComponent />);

          const changeComputedBtn = screen.getByRole("button", {
            name: /change computed/,
          });
          await userEvent.click(changeComputedBtn);

          await waitFor(() =>
            expect(screen.getByText(changedComputedValue)).toBeInTheDocument(),
          );
        });
      });
    });

    describe("Resources", () => {
      const resourceValue = "resource-value";
      const changeResourceValue = "changed-resource";

      it("should render resource value", async () => {
        await render(<QwikComponent />);

        expect(screen.getByText(resourceValue)).toBeInTheDocument();
      });

      describe("when resource changes", () => {
        it("should re-render resource value", async () => {
          await render(<QwikComponent />);

          const changeResourceBtn = screen.getByRole("button", {
            name: /change resource/,
          });
          await userEvent.click(changeResourceBtn);

          await waitFor(() =>
            expect(screen.getByText(changeResourceValue)).toBeInTheDocument(),
          );
        });
      });
    });

    describe("Contexts", () => {
      const contextValue = "context-value";
      const changedContextValue = "changed-context";

      it("should render context value", async () => {
        await render(<QwikComponent />);

        expect(screen.getByText(contextValue)).toBeInTheDocument();
      });

      describe("when context changes", () => {
        it("should re-render context value", async () => {
          await render(<QwikComponent />);

          const changeContextBtn = screen.getByRole("button", {
            name: /change context/,
          });
          await userEvent.click(changeContextBtn);

          await waitFor(() =>
            expect(screen.getByText(changedContextValue)).toBeInTheDocument(),
          );
        });
      });
    });
  });

  describe("Events", () => {
    let firstEvent: Mock;
    let secondEvent: Mock;

    beforeEach(() => {
      firstEvent = vi.fn();
      secondEvent = vi.fn();
    });

    it("should handle multiple events", async () => {
      await render(
        // eslint-disable-next-line qwik/valid-lexical-scope
        <QwikComponent onFirst$={firstEvent} onSecond$={secondEvent} />,
      );

      const eventsBtn = screen.getByRole("button", {
        name: /fire events/,
      });
      await userEvent.click(eventsBtn);

      expect(firstEvent).toHaveBeenCalledTimes(1);
      expect(secondEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe("Tasks", () => {
    const trackedTaskValue = "tracked-task-value";

    describe("when tracked value changes", () => {
      it("should re-render", async () => {
        await render(<QwikComponent />);

        const changeValueBtn = screen.getByRole("button", {
          name: /change tracked/,
        });
        await userEvent.click(changeValueBtn);

        await waitFor(() =>
          expect(screen.getByText(trackedTaskValue)).toBeInTheDocument(),
        );
      });
    });
  });
});
