var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;

var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: value,
      })
    : (obj[key] = value);

var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) {
    __hasOwnProp.call(b, prop) && __defNormalProp(a, prop, b[prop]);
  }
  if (__getOwnPropSymbols) {
    for (var prop of __getOwnPropSymbols(b)) {
      __propIsEnum.call(b, prop) && __defNormalProp(a, prop, b[prop]);
    }
  }
  return a;
};

export var qwikLoader = (doc, hasInitialized) => {
  const Q_CONTEXT = "__q_context__";
  const win = window;
  const events = new Set();
  const roots = new Set([doc]);
  const nativeQuerySelectorAll = (root, selector) =>
    Array.from(root.querySelectorAll(selector));
  const querySelectorAll = (query) => {
    const elements = [];
    roots.forEach((root) =>
      elements.push(...nativeQuerySelectorAll(root, query)),
    );
    return elements;
  };
  const findShadowRoots = (fragment) => {
    processEventOrNode(fragment);
    nativeQuerySelectorAll(fragment, "[q\\:shadowroot]").forEach((parent) => {
      const shadowRoot = parent.shadowRoot;
      shadowRoot && findShadowRoots(shadowRoot);
    });
  };
  const isPromise = (promise) => promise && "function" == typeof promise.then;
  const broadcast = (infix, ev, type = ev.type) => {
    querySelectorAll("[on" + infix + "\\:" + type + "]").forEach((el) =>
      dispatch(el, infix, ev, type),
    );
  };
  const resolveContainer = (containerEl) => {
    if (void 0 === containerEl._qwikjson_) {
      let script = (
        containerEl === doc.documentElement ? doc.body : containerEl
      ).lastElementChild;
      while (script) {
        if (
          "SCRIPT" === script.tagName &&
          "qwik/json" === script.getAttribute("type")
        ) {
          containerEl._qwikjson_ = JSON.parse(
            script.textContent.replace(/\\x3C(\/?script)/gi, "<$1"),
          );
          break;
        }
        script = script.previousElementSibling;
      }
    }
  };
  const createEvent = (eventName, detail) =>
    new CustomEvent(eventName, {
      detail: detail,
    });
  const dispatch = async (element, onPrefix, ev, eventName = ev.type) => {
    const attrName = "on" + onPrefix + ":" + eventName;
    element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();
    const ctx = element._qc_;
    const relevantListeners = ctx && ctx.li.filter((li) => li[0] === attrName);
    if (relevantListeners && relevantListeners.length > 0) {
      for (const listener of relevantListeners) {
        const results = listener[1].getFn(
          [element, ev],
          () => element.isConnected,
        )(ev, element);
        const cancelBubble = ev.cancelBubble;
        isPromise(results) && (await results);
        cancelBubble && ev.stopPropagation();
      }
      return;
    }
    const attrValue = element.getAttribute(attrName);
    if (attrValue) {
      const container = element.closest("[q\\:container]");
      const qBase = container.getAttribute("q:base");
      const qVersion = container.getAttribute("q:version") || "unknown";
      const qManifest = container.getAttribute("q:manifest-hash") || "dev";
      const base = new URL(qBase, doc.baseURI);
      for (const qrl of attrValue.split("\n")) {
        const url = new URL(qrl, base);
        const href = url.href;
        const symbol = url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";
        const reqTime = performance.now();
        let handler;
        let importError;
        let error;
        const isSync = qrl.startsWith("#");
        const eventData = {
          qBase: qBase,
          qManifest: qManifest,
          qVersion: qVersion,
          href: href,
          symbol: symbol,
          element: element,
          reqTime: reqTime,
        };
        if (isSync) {
          const hash = container.getAttribute("q:instance");
          handler = (doc["qFuncs_" + hash] || [])[Number.parseInt(symbol)];
          if (!handler) {
            importError = "sync";
            error = new Error("sync handler error for symbol: " + symbol);
          }
        } else {
          const uri = url.href.split("#")[0];
          try {
            const module = import(uri);
            resolveContainer(container);
            handler = (await module)[symbol];
            if (!handler) {
              importError = "no-symbol";
              error = new Error(`${symbol} not in ${uri}`);
            }
          } catch (err) {
            importError || (importError = "async");
            error = err;
          }
        }
        if (!handler) {
          emitEvent(
            "qerror",
            __spreadValues(
              {
                importError: importError,
                error: error,
              },
              eventData,
            ),
          );
          console.error(error);
          break;
        }
        const previousCtx = doc[Q_CONTEXT];
        if (element.isConnected) {
          try {
            doc[Q_CONTEXT] = [element, ev, url];
            isSync || emitEvent("qsymbol", __spreadValues({}, eventData));
            const results = handler(ev, element);
            isPromise(results) && (await results);
          } catch (error2) {
            emitEvent(
              "qerror",
              __spreadValues(
                {
                  error: error2,
                },
                eventData,
              ),
            );
          } finally {
            doc[Q_CONTEXT] = previousCtx;
          }
        }
      }
    }
  };
  const emitEvent = (eventName, detail) => {
    doc.dispatchEvent(createEvent(eventName, detail));
  };
  const camelToKebab = (str) =>
    str.replace(/([A-Z])/g, (a) => "-" + a.toLowerCase());
  const processDocumentEvent = async (ev) => {
    let type = camelToKebab(ev.type);
    let element = ev.target;
    broadcast("-document", ev, type);
    while (element && element.getAttribute) {
      const results = dispatch(element, "", ev, type);
      let cancelBubble = ev.cancelBubble;
      isPromise(results) && (await results);
      cancelBubble =
        cancelBubble ||
        ev.cancelBubble ||
        element.hasAttribute("stoppropagation:" + ev.type);
      element =
        ev.bubbles && !0 !== cancelBubble ? element.parentElement : null;
    }
  };
  const processWindowEvent = (ev) => {
    broadcast("-window", ev, camelToKebab(ev.type));
  };
  const processReadyStateChange = () => {
    var _a;
    const readyState = doc.readyState;
    if (
      !hasInitialized &&
      ("interactive" == readyState || "complete" == readyState)
    ) {
      roots.forEach(findShadowRoots);
      hasInitialized = 1;
      emitEvent("qinit");
      (null != (_a = win.requestIdleCallback) ? _a : win.setTimeout).bind(win)(
        () => emitEvent("qidle"),
      );
      if (events.has("qvisible")) {
        const results = querySelectorAll("[on\\:qvisible]");
        const observer = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              observer.unobserve(entry.target);
              dispatch(entry.target, "", createEvent("qvisible", entry));
            }
          }
        });
        results.forEach((el) => observer.observe(el));
      }
    }
  };
  const addEventListener = (el, eventName, handler, capture = !1) =>
    el.addEventListener(eventName, handler, {
      capture: capture,
      passive: !1,
    });
  const processEventOrNode = (...eventNames) => {
    for (const eventNameOrNode of eventNames) {
      if ("string" == typeof eventNameOrNode) {
        if (!events.has(eventNameOrNode)) {
          roots.forEach((root) =>
            addEventListener(root, eventNameOrNode, processDocumentEvent, !0),
          );
          addEventListener(win, eventNameOrNode, processWindowEvent, !0);
          events.add(eventNameOrNode);
        }
      } else if (!roots.has(eventNameOrNode)) {
        events.forEach((eventName) =>
          addEventListener(
            eventNameOrNode,
            eventName,
            processDocumentEvent,
            !0,
          ),
        );
        roots.add(eventNameOrNode);
      }
    }
  };
  if (!(Q_CONTEXT in doc)) {
    doc[Q_CONTEXT] = 0;
    const qwikevents = win.qwikevents;
    Array.isArray(qwikevents) && processEventOrNode(...qwikevents);
    win.qwikevents = {
      events: events,
      roots: roots,
      push: processEventOrNode,
    };
    addEventListener(doc, "readystatechange", processReadyStateChange);
    processReadyStateChange();
  }
};
