<div align="center">
<h1>Qwik Testing Library</h1>

<img
height="80"
width="80"
alt="qwik-testing-library logo depicts a high voltage emoji"
src="https://raw.githubusercontent.com/ianlet/qwik-testing-library/main/high-voltage.png"
/>

<p>Simple and complete Qwik testing utilities that encourage good testing practices.</p>

[**Read The Docs**][qtl-docs] | [Edit the docs][qtl-docs-repo]

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![version][version-badge]][package]
[![downloads][downloads-badge]][downloads]
[![MIT License][license-badge]][license]

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]
[![Discord][discord-badge]][discord]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]
<!-- prettier-ignore-end -->
</div>

<hr />

[qtl-docs]: #installation

[qtl-docs-repo]: https://github.com/ianlet/qwik-testing-library/blob/main/README.md

[build-badge]: https://img.shields.io/github/actions/workflow/status/ianlet/qwik-testing-library/ci.yml?style=flat-square

[build]: https://github.com/ianlet/qwik-testing-library/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/ianlet/qwik-testing-library.svg?style=flat-square

[coverage]: https://codecov.io/github/ianlet/qwik-testing-library

[version-badge]: https://img.shields.io/npm/v/@noma.to/qwik-testing-library.svg?style=flat-square

[package]: https://www.npmjs.com/package/@noma.to/qwik-testing-library

[downloads-badge]: https://img.shields.io/npm/dm/@noma.to/qwik-testing-library.svg?style=flat-square

[downloads]: http://www.npmtrends.com/@noma.to/qwik-testing-library

[license-badge]: https://img.shields.io/github/license/ianlet/qwik-testing-library?color=b&style=flat-square

[license]: https://github.com/ianlet/qwik-testing-library/blob/main/LICENSE

[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square

[prs]: http://makeapullrequest.com

[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square

[coc]: https://github.com/ianlet/qwik-testing-library/blob/main/CODE_OF_CONDUCT.md

[discord-badge]: https://img.shields.io/discord/723559267868737556.svg?color=7389D8&labelColor=6A7EC2&logo=discord&logoColor=ffffff&style=flat-square

[discord]: https://qwik.dev/chat

[github-watch-badge]: https://img.shields.io/github/watchers/ianlet/qwik-testing-library.svg?style=social

[github-watch]: https://github.com/ianlet/qwik-testing-library/watchers

[github-star-badge]: https://img.shields.io/github/stars/ianlet/qwik-testing-library.svg?style=social

[github-star]: https://github.com/ianlet/qwik-testing-library/stargazers

[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20qwik-testing-library%20by%20%40noma_hq%20https%3A%2F%2Fgithub.com%2Fianlet%2Fqwik-testing-library%20%F0%9F%91%8D

[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/ianlet/qwik-testing-library.svg?style=social

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [The Problem](#the-problem)
- [This Solution](#this-solution)
- [Installation](#installation)
- [Setup](#setup)
- [Examples](#examples)
    - [Qwikstart](#qwikstart)
    - [Mocking Component Callbacks (experimental)](#mocking-component-callbacks-experimental)
    - [Qwik City - `server$` calls](#qwik-city---server-calls)
- [Gotchas](#gotchas)
- [Issues](#issues)
    - [🐛 Bugs](#-bugs)
    - [💡 Feature Requests](#-feature-requests)
    - [❓ Questions](#-questions)
- [Contributors](#contributors)
- [Acknowledgements](#acknowledgements)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## The Problem

You want to write maintainable tests for your [Qwik][qwik] components.

[qwik]: https://qwik.dev/

## This Solution

`@noma.to/qwik-testing-library` is a lightweight library for testing Qwik
components. It provides functions on top of `qwik` and
`@testing-library/dom` so you can mount Qwik components and query their
rendered output in the DOM. Its primary guiding principle is:

> [The more your tests resemble the way your software is used, the more
> confidence they can give you.][guiding-principle]

[guiding-principle]: https://twitter.com/kentcdodds/status/977018512689455106

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```shell
npm install --save-dev @noma.to/qwik-testing-library @testing-library/dom
```

This library supports `qwik` versions `1.7.2` and above and `@testing-library/dom` versions `10.1.0` and above.

You may also be interested in installing `@testing-library/jest-dom` and `@testing-library/user-event` so you can
use [the custom jest matchers][jest-dom] and [the user event library][user-event] to test interactions with the DOM.

```shell
npm install --save-dev @testing-library/jest-dom @testing-library/user-event
```

Finally, we need a DOM environment to run the tests in.
This library was tested (for now) only with `jsdom` so we recommend using it:

```shell
npm install --save-dev jsdom
```

[npm]: https://www.npmjs.com/

[node]: https://nodejs.org

[jest-dom]: https://github.com/testing-library/jest-dom

[user-event]: https://github.com/testing-library/user-event

## Setup

We recommend using `@noma.to/qwik-testing-library` with [Vitest][vitest] as your test
runner.

If you haven't done so already, add vitest to your project using Qwik CLI:

```shell
npm qwik add vitest
```

After that, we need to configure Vitest so it can run your tests.
For this, create a _separate_ `vitest.config.ts` so you don't have to modify your project's `vite.config.ts`:

```ts
// vitest.config.ts

import {defineConfig, mergeConfig} from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      // qwik-testing-library needs to consider your project as a Qwik lib
      // if it's already a Qwik lib, you can remove this section
      build: {
        target: "es2020",
        lib: {
          entry: "./src/index.ts",
          formats: ["es", "cjs"],
          fileName: (format, entryName) =>
            `${entryName}.qwik.${format === "es" ? "mjs" : "cjs"}`,
        },
      },
      // configure your test environment
      test: {
        environment: "jsdom",
        setupFiles: ["./vitest.setup.ts"],
        globals: true,
      },
    }),
  ),
);
```

For now, `qwik-testing-library` needs to consider your project as a lib ([PR welcomed][prs] to simplify this).
Hence, the `build.lib` section in the config above.

As the build will try to use `./src/index.ts` as the entry point, we need to create it:

```ts
// ./src/index.ts

/**
 * DO NOT DELETE THIS FILE
 *
 * This entrypoint is needed by @noma.to/qwik-testing-library to run your tests
 */
```

Then, create the `vitest.setup.ts` file:

```ts
// vitest.setup.ts

// Configure DOM matchers to work in Vitest
import "@testing-library/jest-dom/vitest";

// This has to run before qdev.ts loads. `beforeAll` is too late
globalThis.qTest = false; // Forces Qwik to run as if it was in a Browser
globalThis.qRuntimeQrl = true;
globalThis.qDev = true;
globalThis.qInspector = false;
```

This setup will make sure that Qwik is properly configured.
It also loads `@testing-library/jest-dom/vitest` in your test runner
so you can use matchers like `expect(...).toBeInTheDocument()`.

By default, Qwik Testing Library cleans everything up automatically for you.
You can opt out of this by setting the environment variable `QTL_SKIP_AUTO_CLEANUP` to `true`.
Then in your tests, you can call the `cleanup` function when needed.
For example:

```ts
import {cleanup} from "@noma.to/qwik-testing-library";
import {afterEach} from "vitest";

afterEach(cleanup);
```

Finally, edit your `tsconfig.json` to declare the following global types:

```diff
// tsconfig.json

{
  "compilerOptions": {
    "types": [
+     "vite/client",
+     "vitest/globals",
+     "@testing-library/jest-dom/vitest"
    ]
  },
  "include": ["src"]
}
```

[vitest]: https://vitest.dev/

## Examples

Below are some examples of how to use `@noma.to/qwik-testing-library` to tests your Qwik components.

You can also learn more about the [**queries**][tl-queries-docs] and [**user events**][tl-user-events-docs] over at the
Testing Library website.

[tl-queries-docs]: https://testing-library.com/docs/queries/about

[tl-user-events-docs]: https://testing-library.com/docs/user-event/intro

### Qwikstart

This is a minimal setup to get you started, with line-by-line explanations.

```tsx
// counter.spec.tsx

// import qwik-testing methods
import {screen, render, waitFor} from "@noma.to/qwik-testing-library";
// import the userEvent methods to interact with the DOM
import {userEvent} from "@testing-library/user-event";
// import the component to be tested
import {Counter} from "./counter";

// describe the test suite
describe("<Counter />", () => {
  // describe the test case
  it("should increment the counter", async () => {
    // render the component into the DOM
    await render(<Counter/>);

    // retrieve the 'increment count' button
    const incrementBtn = screen.getByRole("button", {name: /increment count/});
    // click the button twice
    const user = userEvent.setup();
    await user.click(incrementBtn);
    await user.click(incrementBtn);

    // assert that the counter is now 2
    await waitFor(() => expect(screen.getByText(/count:2/)).toBeInTheDocument());
  });
})
```

### Mocking Component Callbacks (experimental)

> [!WARNING]
> This feature is under a testing phase and thus experimental.
> Its API may change in the future, so use it at your own risk.

The Qwik Testing Library provides a `mock$` function
that can be used to create a mock of a QRL and verify interactions on your Qwik components.

It is _not_ a replacement of regular mocking functions (such as `vi.fn` and `vi.mock`) as its intended use is only for
testing callbacks of Qwik components.

Here's an example on how to use the `mock$` function:

```tsx title="counter.spec.tsx"
// import qwik-testing methods
import {mock$, clearAllMock, render, screen, waitFor} from "@noma.to/qwik-testing-library";
// import the userEvent methods to interact with the DOM
import {userEvent} from "@testing-library/user-event";

// import the component to be tested
import {Counter} from "./counter";

// describe the test suite
describe("<Counter />", () => {
  // initialize a mock
  // note: the empty callback is required but currently unused
  const onChangeMock = mock$(() => {
  });

  // setup beforeEach block to run before each test
  beforeEach(() => {
    // remember to always clear all mocks before each test
    clearAllMocks();
  });

  // describe the 'on increment' test cases
  describe("on increment", () => {
    // describe the test case
    it("should call onChange$", async () => {
      // render the component into the DOM
      await render(<Counter value={0} onChange$={onChangeMock}/>);

      // retrieve the 'decrement' button
      const decrementBtn = screen.getByRole("button", {name: "Decrement"});
      // click the button
      const user = userEvent.setup();
      await user.click(decrementBtn);

      // assert that the onChange$ callback was called with the right value
      // note: QRLs are async in Qwik, so we need to resolve them to verify interactions
      await waitFor(() =>
        expect(onChangeMock.resolve()).resolves.toHaveBeenCalledWith(-1),
      );
    });
  });
})
```

### Qwik City - `server$` calls

If one of your Qwik components uses `server$` calls, your tests might fail with a rather cryptic message (e.g. `QWIK
ERROR __vite_ssr_import_0__.myServerFunctionQrl is not a function` or
`QWIK ERROR Failed to parse URL from ?qfunc=DNpotUma33o`).

We're happy to discuss it on [Discord][discord], but we consider this failure to be a good thing:
your components should be tested in isolation, so you will be forced to mock your server functions.

Here is an example of how to test a component that uses `server$` calls:

```ts
// ~/server/blog-posts.ts

import {server$} from "@builder.io/qwik-city";
import {BlogPost} from "~/lib/blog-post";

export const getLatestPosts$ = server$(function (): Promise<BlogPost> {
  // get the latest posts
  return Promise.resolve([]);
});
```

```tsx
// ~/components/latest-post-list.spec.tsx

import {render, screen, waitFor} from "@noma.to/qwik-testing-library";
import {LatestPostList} from "./latest-post-list";

vi.mock('~/server/blog-posts', () => ({
  // the mocked function should end with `Qrl` instead of `$`
  getLatestPostsQrl: () => {
    return Promise.resolve([{id: 'post-1', title: 'Post 1'}, {id: 'post-2', title: 'Post 2'}]);
  },
}));

describe('<LatestPostList />', () => {
  it('should render the latest posts', async () => {
    await render(<LatestPostList/>);

    await waitFor(() => expect(screen.queryAllByRole('listitem')).toHaveLength(2));
  });
});
```

Notice how the mocked function is ending with `Qrl` instead of `$`, despite being named as `getLatestPosts$`.
This is caused by the Qwik optimizer renaming it to `Qrl`.
So, we need to mock the `Qrl` function instead of the original `$` one.

If your function doesn't end with `$`, the Qwik optimizer will not rename it to `Qrl`.

## Gotchas

* Watch mode (at least in Webstorm) doesn't seem to work well: components are not being updated with your latest changes

## Issues

_Looking to contribute? Look for the [Good First Issue][good-first-issue]
label._

[good-first-issue]: https://github.com/ianlet/qwik-testing-library/issues?utf8=✓&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3A"good+first+issue"+

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**][bugs]

[bugs]: https://github.com/ianlet/qwik-testing-library/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Acreated-desc

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**][requests]

[requests]: https://github.com/ianlet/qwik-testing-library/issues?q=is%3Aissue+sort%3Areactions-%2B1-desc+label%3Aenhancement+is%3Aopen

### ❓ Questions

For questions related to using the library, please visit a support community
instead of filing an issue on GitHub.

- [Discord][discord]
- [Stack Overflow][stackoverflow]

[stackoverflow]: https://stackoverflow.com/questions/tagged/qwik-testing-library

## Contributors

Thanks goes to these people ([emoji key][emojis]):
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://noma.to/"><img src="https://avatars.githubusercontent.com/u/6018732?v=4?s=100" width="100px;" alt="Ian Létourneau"/><br /><sub><b>Ian Létourneau</b></sub></a><br /><a href="https://github.com/ianlet/qwik-testing-library/commits?author=ianlet" title="Code">💻</a> <a href="https://github.com/ianlet/qwik-testing-library/commits?author=ianlet" title="Tests">⚠️</a> <a href="#ideas-ianlet" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ianlet/qwik-testing-library/commits?author=ianlet" title="Documentation">📖</a> <a href="#example-ianlet" title="Examples">💡</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

[emojis]: https://github.com/all-contributors/all-contributors#emoji-key

[all-contributors]: https://github.com/all-contributors/all-contributors

## Acknowledgements

Massive thanks to the [Qwik Team][qwik-team] and the whole community for their efforts to build Qwik and for
the [inspiration][qwik-baseline] on how to create a testing library for Qwik.

Thanks to the [Testing Library Team][tl-team] for a great set of tools to build better products, confidently, and
qwikly.

[qwik-team]: https://github.com/QwikDev/qwik/

[qwik-baseline]: https://github.com/QwikDev/qwik/tree/main/packages/qwik/src/testing

[tl-team]: https://testing-library.com