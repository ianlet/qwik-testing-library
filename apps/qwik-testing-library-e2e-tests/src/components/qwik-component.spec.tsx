import { QwikComponent } from "./qwik-component";
import { render, screen } from "@noma.to/qwik-testing-library";
import { userEvent } from "@testing-library/user-event";

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
        const user = userEvent.setup();
        await user.click(changePropBtn);

        expect(await screen.findByText(changedProp)).toBeInTheDocument();
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
        const user = userEvent.setup();
        await user.click(changeConditionBtn);

        expect(await screen.findByText(conditionalValue)).toBeInTheDocument();
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

        expect(await screen.findByText(signalValue)).toBeInTheDocument();
      });

      describe("when signal changes", () => {
        it("should re-render signal value", async () => {
          await render(<QwikComponent />);

          const changeSignalBtn = screen.getByRole("button", {
            name: /change signal/,
          });
          const user = userEvent.setup();
          await user.click(changeSignalBtn);

          expect(
            await screen.findByText(changedSignalValue),
          ).toBeInTheDocument();
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
          const user = userEvent.setup();
          await user.click(changeStoreBtn);

          expect(
            await screen.findByText(changedStoreValue),
          ).toBeInTheDocument();
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
          const user = userEvent.setup();
          await user.click(changeComputedBtn);

          expect(
            await screen.findByText(changedComputedValue),
          ).toBeInTheDocument();
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
          const user = userEvent.setup();
          await user.click(changeResourceBtn);

          expect(
            await screen.findByText(changeResourceValue),
          ).toBeInTheDocument();
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
          const user = userEvent.setup();
          await user.click(changeContextBtn);

          expect(
            await screen.findByText(changedContextValue),
          ).toBeInTheDocument();
        });
      });
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
        const user = userEvent.setup();
        await user.click(changeValueBtn);

        expect(await screen.findByText(trackedTaskValue)).toBeInTheDocument();
      });
    });
  });
});
