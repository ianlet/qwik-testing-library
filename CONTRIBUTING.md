# Contributing guide

## Pull requests

- Consider opening an issue before submitting a pull-request to avoid unnecessary work
- Ensure pull request titles adhere to the [Conventional Commits][] specification

[conventional commits]: https://www.conventionalcommits.org/

## Release

The module is released automatically from the `main` and `next` branches using [semantic-release-action][]. Version
bumps and change logs are generated from the commit messages.

[semantic-release-action]: https://github.com/cycjimmy/semantic-release-action

### Preview release

If you would like to preview the release from a given branch, and...

- You have push access to the repository
- The branch exists in GitHub

...you can preview the next release version and changelog using:

```shell
pnpm run preview-release
```

## Development setup

After cloning the repository, install the project's dependencies and run the `validate` script to run all checks and
tests to verify your setup.

```shell
pnpm install
pnpm validate
```

### Lint and format

Run auto-formatting to ensure any changes adhere to the code style of the repository:

```shell
pnpm -r fmt
```

To run lint and format checks without making any changes:

```shell
pnpm -r fmt.check
```

### Test

Run unit tests once:

```shell
pnpm -r test
```

### Docs

Use the `toc` script to ensure the README's table of contents is up to date:

```shell
pnpm toc
```

Use `contributors:add` to add a contributor to the README:

```shell
pnpm contributors:add
```

Use `contributors:generate` to ensure the README's contributor list is up to date:

```shell
pnpm contributors:generate
```