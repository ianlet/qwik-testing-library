import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { CorePlatform } from "@builder.io/qwik";

function createPlatform() {
  const moduleCache = new Map<string, { [symbol: string]: any }>();
  const testPlatform: CorePlatform = {
    isServer: false,
    importSymbol(containerEl, url, symbolName) {
      if (!url) {
        throw new Error("Missing URL");
      }
      if (!containerEl) {
        throw new Error("Missing Container");
      }
      const urlDoc = toUrl(containerEl.ownerDocument, containerEl, url);
      const importPath = toPath(urlDoc);
      const mod = moduleCache.get(importPath);
      if (mod) {
        if (!mod || !(symbolName in mod)) {
          throw new Error(
            `Q-ERROR: missing symbol '${symbolName}' in module '${url}'.`,
          );
        }
        return mod[symbolName];
      }
      return import(importPath).then((mod) => {
        moduleCache.set(importPath, mod);
        if (!mod || !(symbolName in mod)) {
          throw new Error(
            `Q-ERROR: missing symbol '${symbolName}' in module '${url}'.`,
          );
        }
        return mod[symbolName];
      });
    },
    nextTick: (fn) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn());
        });
      });
    },
    raf: (fn) => {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          resolve(fn());
        });
      });
    },
    chunkForSymbol(symbol) {
      return undefined;
    },
  };
  return testPlatform;
}

export function setTestPlatform(_setPlatform: Function) {
  _setPlatform(testPlatform);
}

/**
 * Convert relative base URI and relative URL into a fully qualified URL.
 *
 * @param base -`QRL`s are relative, and therefore they need a base for resolution.
 *
 *   - `Element` use `base.ownerDocument.baseURI`
 *   - `Document` use `base.baseURI`
 *   - `string` use `base` as is
 *   - `QConfig` use `base.baseURI`
 *
 * @param url - Relative URL
 * @returns Fully qualified URL.
 */
export function toUrl(
  doc: Document,
  containerEl: Element,
  url: string | URL,
): URL {
  const base = new URL(
    containerEl?.getAttribute("q:base") ?? doc.baseURI,
    doc.baseURI,
  );
  return new URL(url, base);
}

function toPath(url: URL) {
  const normalizedUrl = new URL(String(url));
  normalizedUrl.hash = "";
  normalizedUrl.search = "";
  const path = fileURLToPath(String(normalizedUrl));
  const importPaths = [path, ...testExts.map((ext) => path + ext)];

  for (const importPath of importPaths) {
    if (existsSync(importPath)) {
      return importPath;
    }
  }

  throw new Error(`Unable to find path for import "${url}"`);
}

const testPlatform = createPlatform();

/** @public */
export function getTestPlatform(): CorePlatform {
  return testPlatform;
}

const testExts = [".ts", ".tsx", ".js", ".cjs", ".mjs", ".jsx"];
