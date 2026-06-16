# Development Guide

## Repository Layout

- `bin/ur.js` launches the TypeScript CLI through Bun.
- `src/entrypoints/cli.tsx` handles fast startup paths before loading the full CLI.
- `src/main.tsx` defines top-level CLI flags and subcommands.
- `src/commands.ts` registers slash commands and command modules.
- `src/tools/` contains tool implementations.
- `src/services/` contains API, MCP, analytics, sync, and runtime services.
- `src/components/` and `src/ink/` implement the terminal UI.
- `examples/` contains example prompts and workflows.
- `test/` contains Bun tests for local UR utility modules.

## Install

```sh
bun install
```

## Run

```sh
bun run start
bun run dev
```

`bun run start` uses `bin/ur.js`. `bun run dev` runs `src/entrypoints/cli.tsx` directly with watch mode and the Bun bundle preload.

## Verify

```sh
bun run typecheck
bun test
```

There is no `test` script in `package.json`; run `bun test` directly.

## Build

```sh
bun run build
```

The build output goes to `dist/`, which is ignored by Git.

## Local Command Link

From the repository root:

```sh
bun link
ur --version
```

## Publishing Notes

The package currently has:

```json
"private": true
```

That prevents accidental package publishing. For GitHub distribution, keep the repository source-focused and let users install dependencies with Bun.

Before making the repository public:

- Add a license if others should be allowed to reuse or modify the code.
- Review `.gitignore` and `git status` before the first commit.
- Confirm no local credentials or generated runtime state are staged.
