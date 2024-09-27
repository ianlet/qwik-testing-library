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

[qtl-docs]: https://github.com/ianlet/qwik-testing-library/blob/main/README.md#installation

[qtl-docs-repo]: https://github.com/ianlet/qwik-testing-library/blob/main/README.md

[build-badge]: https://img.shields.io/github/actions/workflow/status/ianlet/qwik-testing-library/release.yml?style=flat-square

[build]: https://github.com/ianlet/qwik-testing-library/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/g.svg?style=flat-square

[coverage]: https://codecov.io/github/g

[version-badge]: https://img.shields.io/npm/v/@noma.to/qwik-testing-library.svg?style=flat-square

[package]: https://www.npmjs.com/package/@noma.to/qwik-testing-library

[downloads-badge]: https://img.shields.io/npm/dm/@noma.to/qwik-testing-library.svg?style=flat-square

[downloads]: http://www.npmtrends.com/@noma.to/qwik-testing-library

[license-badge]: https://img.shields.io/github/license/g?color=b&style=flat-square

[license]: https://github.com/ianlet/qwik-testing-library/blob/main/LICENSE

[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square

[prs]: http://makeapullrequest.com

[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square

[coc]: https://github.com/ianlet/qwik-testing-library/blob/main/CODE_OF_CONDUCT.md

[discord-badge]: https://img.shields.io/discord/723559267868737556.svg?color=7389D8&labelColor=6A7EC2&logo=discord&logoColor=ffffff&style=flat-square

[discord]: https://qwik.dev/chat

[github-watch-badge]: https://img.shields.io/github/watchers/g.svg?style=social

[github-watch]: https://github.com/ianlet/qwik-testing-library/watchers

[github-star-badge]: https://img.shields.io/github/stars/g.svg?style=social

[github-star]: https://github.com/ianlet/qwik-testing-library/stargazers

[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20qwik-testing-library%20by%20%40@noma_hq%20https%3A%2F%2Fgithub.com%2Fianlet%2Fqwik-testing-library%20%F0%9F%91%8D

[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/g.svg?style=social

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

- [The Problem](#the-problem)
- [This Solution](#this-solution)
- [Installation](#installation)
- [Setup](#setup)
- [Docs](#docs)
- [Issues](#issues)
    - [🐛 Bugs](#-bugs)
    - [💡 Feature Requests](#-feature-requests)
    - [❓ Questions](#-questions)
- [Contributors](#contributors)
- [Gotchas](#gotchas)

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
npm install --save-dev @noma.to/qwik-testing-library
```

This library supports `svelte` versions `3`, `4`, and `5`.

You may also be interested in installing `@testing-library/jest-dom` so you can
use [the custom jest matchers][jest-dom].

[npm]: https://www.npmjs.com/

[node]: https://nodejs.org

[jest-dom]: https://github.com/testing-library/jest-dom

## Setup

We recommend using `@noma.to/qwik-testing-library` with [Vitest][] as your test
runner. To get started, add the `svelteTesting` plugin to your Vite or Vitest
config.

```diff
  // vite.config.js
  import { svelte } from '@sveltejs/vite-plugin-svelte'
+ import { svelteTesting } from '@noma.to/qwik-testing-library/vite'

  export default defineConfig({
    plugins: [
      svelte(),
+     svelteTesting(),
    ]
  });
```

See the [setup docs][] for more detailed setup instructions.

[vitest]: https://vitest.dev/

[setup docs]: https://testing-library.com/docs/svelte-testing-library/setup

## Docs

See the [**docs**][qtl-docs] over at the Testing Library website.

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

## Gotchas

* Watch mode (at least in Webstorm) doesn't seem to work well: components are not being updated with your latest changes