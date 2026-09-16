import { configure, getQueriesForElement, prettyDOM } from "@testing-library/dom";
import type { JSXOutput } from "@qwik.dev/core";
import { getQwikLoaderScript } from "@qwik.dev/core/server";
import type {
  ComponentRef,
  RenderOptions,
  RenderHookOptions,
  RenderHookResult,
  Result,
} from "./types";

// Patch HTMLTemplateElement.childNodes for happy-dom compatibility
//
// Qwik's VirtualElementImpl uses a <template> element as temporary storage for detached content.
// It calls `template.insertBefore(node)` to store nodes and reads them back via `template.childNodes`.
//
// In real browsers and jsdom, `insertBefore` on a template adds direct children.
// However, happy-dom redirects insertions to `template.content`, leaving `childNodes` empty.
//
// This patch makes `template.childNodes` return `template.content.childNodes` for happy-dom.
if (typeof HTMLTemplateElement !== "undefined") {
  // Detect if this DOM implementation needs the patch by testing behavior
  const testTemplate = document.createElement("template");
  const testNode = document.createComment("test");
  testTemplate.insertBefore(testNode, null);
  const needsPatch = testTemplate.childNodes.length === 0;
  testNode.remove();

  if (needsPatch) {
    Object.defineProperty(HTMLTemplateElement.prototype, "childNodes", {
      get() {
        return this.content.childNodes;
      },
    });
  }
}

// if we're running in a test runner that supports afterEach
// then we'll automatically run cleanup afterEach test
// this ensures that tests run in isolation from each other
// if you don't like this, set the QTL_SKIP_AUTO_CLEANUP env variable to 'true'
if (typeof process === "undefined" || !process.env?.QTL_SKIP_AUTO_CLEANUP) {
  if (typeof afterEach === "function") {
    afterEach(() => {
      cleanup();
    });
  }
}

const mountedContainers = new Set<ComponentRef>();

type QDispatchHandler = (event: Event, element: Element) => unknown;
type QDispatchElement = Element & {
  _qDispatch?: Record<string, QDispatchHandler | QDispatchHandler[]>;
};
type QwikContainer = { $renderPromise$?: Promise<unknown> | null };

// Detect whether the rendered tree contains a `useVisibleTask$`. Client-rendered
// components store the handler on `element._qDispatch["e:qvisible"]` (unlike SSR,
// they don't emit the `q-e:qvisible` attribute the loader scans for).
//
// We only *detect* here — we must not invoke the handler. Qwik already schedules the
// visible task to run on a macrotask during render; invoking `_qDispatch` ourselves
// would run it a *second* time (the classic double-fire: a `useVisibleTask$` side
// effect happening twice per mount). Instead, when a visible task is present we let
// settleVisibleTasks() drain qwik's own scheduled run — the single, real execution.
function hasVisibleTasks(root: Element): boolean {
  const elements = [root, ...root.querySelectorAll("*")] as QDispatchElement[];
  return elements.some((el) => el._qDispatch?.["e:qvisible"] != null);
}

// Wait for pending render work to settle. Qwik v2 runs its render/reactive chores
// as microtasks, so this awaits the container's render promise and yields
// microtasks until no further render is pending. It follows multi-hop chains
// (signal -> computed -> conditional render) and, being timer-free, stays fast
// even across many renders. (`waitForDrain` from the testing package can't be used
// here: its internal poll isn't awaited, so it races and returns early.)
async function settle(container: QwikContainer): Promise<void> {
  let idle = 0;
  // A handful of consecutive idle microtasks means the reactive graph has quiesced.
  for (let i = 0; i < 1000 && idle < 5; i++) {
    if (container.$renderPromise$) {
      await container.$renderPromise$;
      idle = 0;
    } else {
      await Promise.resolve();
      idle++;
    }
  }
}

// Visible tasks (and the re-renders they schedule) run on macrotasks/raf rather
// than microtasks, so the fast microtask settle() can't see them. This is only
// used on renders that actually have a `useVisibleTask$`, so the common path stays
// timer-free. Wait (bounded) for the re-render to be scheduled, then drain it.
async function settleVisibleTasks(container: QwikContainer): Promise<void> {
  // A macrotask tick. Prefer setTimeout: it matches the timing of the re-render Qwik actually
  // schedules, so we don't return before it lands. But `vi.useFakeTimers()` freezes setTimeout,
  // which would deadlock this loop (render() never resolves). Only in that case fall back to a
  // MessageChannel macrotask — not faked, so it still resolves (and under fake timers the
  // re-render is frozen anyway, so there's nothing slower to wait for).
  const viGlobal = (globalThis as { vi?: { isFakeTimers?: () => boolean } }).vi;
  const fakeTimers =
    typeof viGlobal?.isFakeTimers === "function" && viGlobal.isFakeTimers();
  const tick: () => Promise<void> =
    fakeTimers && typeof MessageChannel !== "undefined"
      ? () =>
          new Promise((resolve) => {
            const channel = new MessageChannel();
            channel.port1.onmessage = () => {
              channel.port1.close();
              channel.port2.close();
              resolve();
            };
            channel.port2.postMessage(null);
          })
      : () => new Promise((resolve) => setTimeout(resolve));
  for (let i = 0; i < 50 && !container.$renderPromise$; i++) {
    await tick();
  }
  let idle = 0;
  for (let i = 0; i < 100 && idle < 2; i++) {
    if (container.$renderPromise$) {
      await container.$renderPromise$;
      idle = 0;
    } else {
      await tick();
      idle++;
    }
  }
}

// Settle every currently-mounted container. Used as testing-library's asyncWrapper
// so pending renders triggered by an interaction (fireEvent/userEvent/signal write)
// are flushed before/while async queries (findBy*, waitFor) evaluate.
async function settleAll(): Promise<void> {
  for (const ref of mountedContainers) {
    if (ref.qwikContainer) {
      await settle(ref.qwikContainer);
    }
  }
}

// Drain pending renders while async queries (findBy*, waitFor) run, so updates
// scheduled by an interaction are reflected without each test flushing manually.
configure({
  asyncWrapper: async (cb) => {
    await settleAll();
    return cb();
  },
});

async function render(ui: JSXOutput, options: RenderOptions = {}): Promise<Result> {
  const qwik = await import("@qwik.dev/core");
  const { getTestPlatform } = await import("@qwik.dev/core/testing");
  // `setPlatform`/`getDomContainer` are runtime exports of `@qwik.dev/core` but are
  // only typed on the `/internal` entry (same underlying module).
  const { setPlatform, getDomContainer } = await import("@qwik.dev/core/internal");

  // Qwik v2 defers rendering to a platform scheduler. Install the test platform so
  // we can deterministically wait for that work to settle (see settle()). (Cast
  // bridges a beta type gap: TestPlatform should extend CorePlatform but isn't
  // declared so.)
  setPlatform(getTestPlatform() as unknown as Parameters<typeof setPlatform>[0]);

  let { container, baseElement = container } = options;
  const { wrapper: Wrapper } = options;
  const { queries, serverData } = options;

  if (!baseElement) {
    // Default to document.body instead of documentElement to avoid output of potentially large
    // head elements (such as JSS style blocks) in debug output.
    baseElement = document.body;
  }

  if (!container) {
    container = baseElement.insertBefore(
      document.createElement("host"),
      baseElement.firstChild,
    );
  }

  // Wrap the component under test if a wrapper is provided
  const wrappedUi = !Wrapper ? ui : <Wrapper children={ui} />;

  const doc = baseElement.ownerDocument;
  const win = doc.defaultView;

  // Defer `window.requestAnimationFrame` for the duration of render()/settling. Qwik runs its own
  // deferred work — including `useVisibleTask$` execution — through the platform scheduler (a
  // setTimeout), not `window.rAF`. settleVisibleTasks drains that by ticking the timer queue, which
  // also fires any app-scheduled rAF callbacks (happy-dom/jsdom back rAF with a timer). A component
  // whose visible task coexists with an rAF side effect — e.g. an exit-animation engine that
  // unmounts a closing layer on the next frame — would otherwise have that side effect run *during*
  // render(), collapsing the just-mounted state a test needs to observe. Capture the callbacks here
  // and replay them on a real frame once settled, so they fire after render() returns (during the
  // test's awaits), exactly as a real animation frame would.
  const rafWin = win as
    | (Window & { requestAnimationFrame: (cb: FrameRequestCallback) => number })
    | null;
  const realRaf = rafWin?.requestAnimationFrame?.bind(rafWin) ?? null;
  const capturedRafCbs: FrameRequestCallback[] = [];
  if (rafWin && realRaf) {
    rafWin.requestAnimationFrame = (cb: FrameRequestCallback) => {
      capturedRafCbs.push(cb);
      return capturedRafCbs.length;
    };
  }

  let cleanup!: () => void;
  let qContainer!: QwikContainer;
  try {
    ({ cleanup } = await qwik.render(container, wrappedUi, { serverData }));
    qContainer = getDomContainer(container) as unknown as QwikContainer;
    // Wait for the deferred render work to settle so the DOM is fully materialized
    // before queries run.
    await settle(qContainer);

    // Load the Qwik loader AFTER rendering: Qwik collects the event names it needs
    // to listen for (on `window._qwikEv`) while rendering, and the loader wires up
    // its delegated listeners from that list. Injecting it earlier would miss them.
    // The loader is what routes real DOM events (fireEvent/userEvent) to Qwik's
    // client-side handlers stored on each element's `_qDispatch`.
    //
    // When the tree has a `useVisibleTask$`, the loader creates its own IntersectionObserver
    // to delegate `qvisible`. In tests it observes nothing (client renders store the handler on
    // `_qDispatch`, not the `q-e:qvisible` attribute the loader scans — see hasVisibleTasks), so
    // it's a pure artifact. But a spec that stubs `IntersectionObserver` (vi.stubGlobal) to count
    // instances would count this one too, inflating the count. Neutralize it for the duration of
    // the loader run so specs only see the observers their own component created; restore the real
    // (or stubbed) constructor immediately after. This doesn't touch the loader's click/input
    // delegation, only its intersection observer.
    const win_ = win as unknown as { IntersectionObserver?: unknown } | null;
    const realIntersectionObserver = win_?.IntersectionObserver;
    if (win_ && realIntersectionObserver) {
      win_.IntersectionObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      };
    }
    new Function("document", "window", getQwikLoaderScript())(doc, win);
    if (win_ && realIntersectionObserver) {
      win_.IntersectionObserver = realIntersectionObserver;
    }

    // If the tree has a `useVisibleTask$`, drain the macrotask-scheduled run qwik
    // queued for it (settle() only sees microtasks). We wait for qwik's own run
    // rather than invoking the handler — see hasVisibleTasks() for why.
    if (hasVisibleTasks(container)) {
      await settleVisibleTasks(qContainer);
    }
  } finally {
    // Restore rAF and replay whatever the app queued, on a real frame after render() has settled.
    if (rafWin && realRaf) {
      rafWin.requestAnimationFrame = realRaf;
      for (const cb of capturedRafCbs) {
        realRaf(cb);
      }
    }
  }

  mountedContainers.add({
    container,
    componentCleanup: cleanup,
    qwikContainer: qContainer,
  });

  return {
    container,
    baseElement,
    asFragment: () => {
      if (typeof document.createRange === "function") {
        return document
          .createRange()
          .createContextualFragment(container.innerHTML);
      } else {
        const template = document.createElement("template");
        template.innerHTML = container.innerHTML;
        return template.content;
      }
    },
    debug: (el = baseElement, maxLength, options) =>
      Array.isArray(el)
        ? el.forEach((e) => console.log(prettyDOM(e, maxLength, options)))
        : console.log(
            prettyDOM(el, maxLength, { ...options, filterNode: () => true }),
          ),
    unmount: cleanup,
    ...getQueriesForElement(container, queries),
  };
}

function cleanupAtContainer(ref: ComponentRef) {
  const { container, componentCleanup } = ref;

  componentCleanup();

  // Tear down the Qwik container too. Qwik attaches `qDestroy` to the container
  // element; it resets the document-level vnode bookkeeping (qVNodeData,
  // qVNodeDataReady, ...) that is otherwise shared across renders and would leak
  // into — and break — subsequent renders in the same test file.
  (container as Element & { qDestroy?: () => void }).qDestroy?.();

  if (container?.parentNode === document.body) {
    document.body.removeChild(container);
  }

  mountedContainers.delete(ref);
}

function cleanup() {
  mountedContainers.forEach(cleanupAtContainer);
}

async function renderHook<Result>(
  callback: () => Result,
  options: RenderHookOptions = {},
): Promise<RenderHookResult<Result>> {
  const { component$, noSerialize, isSignal } = await import("@qwik.dev/core");

  const callbackRef = noSerialize(callback);
  const resultRef = noSerialize({ current: undefined as Result | undefined });

  const TestComponent = component$(() => {
    resultRef!.current = callbackRef!();
    return <></>;
  });

  const { unmount } = await render(<TestComponent />, {
    wrapper: options.wrapper,
  });

  // A hook can return computed signals. On v2 a computed's value is lazy — its
  // compute QRL only resolves once the signal is read in a tracking context, which
  // never happens here because the hook result isn't rendered. Force-resolve any
  // signals in the result so consumers can read `.value` synchronously.
  await forceResolveSignals(resultRef!.current, isSignal);

  return { result: resultRef!.current as Result, unmount };
}

const isPromiseLike = (v: unknown): v is Promise<unknown> =>
  !!v && typeof (v as { then?: unknown }).then === "function";

async function forceResolveSignals(
  value: unknown,
  isSignal: (v: unknown) => boolean,
  seen = new Set<unknown>(),
  depth = 0,
): Promise<void> {
  if (!value || typeof value !== "object" || seen.has(value) || depth > 4) {
    return;
  }
  seen.add(value);

  if (isSignal(value)) {
    // Reading `.value` triggers computation; a lazy compute QRL throws its
    // resolution promise, so await it and retry until the value is available.
    for (let i = 0; i < 20; i++) {
      try {
        void (value as { value: unknown }).value;
        return;
      } catch (thrown) {
        if (isPromiseLike(thrown)) {
          await thrown;
        } else {
          return;
        }
      }
    }
    return;
  }

  for (const key of Object.keys(value)) {
    let child: unknown;
    try {
      child = (value as Record<string, unknown>)[key];
    } catch {
      continue;
    }
    await forceResolveSignals(child, isSignal, seen, depth + 1);
  }
}

export * from "@testing-library/dom";
export { cleanup, render, renderHook };
