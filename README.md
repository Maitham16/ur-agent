# UR

UR is a Bun/TypeScript terminal coding agent. It starts an interactive session by default, can run once in print mode for scripts, and supports project context, slash commands, MCP servers, plugins, skills, and custom agents.

This repository currently runs the source entry point through `bin/ur.js`. The wrapper requires Bun and sets an Ollama-compatible default model if no model is provided.

## Requirements

- Bun. This workspace was verified with Bun 1.3.14.
- Node.js-compatible shell environment
- An Ollama-compatible server for model requests
- Optional: GitHub CLI, tmux, and IDE integrations for workflows that use them

## Quick Start

```sh
bun install
bun run start
```

To make the `ur` command available from this checkout during development:

```sh
bun link
ur
```

If the default model is not available, choose a model explicitly:

```sh
UR_MODEL=qwen2.5-coder:latest bun run start
```

The launch wrapper reads `OLLAMA_MODEL` first, then `UR_MODEL`, and otherwise falls back to `kimi-k2.7-code:cloud`.

## Common Usage

Start an interactive session:

```sh
ur
```

Ask one question and print the answer:

```sh
ur -p "summarize this repository"
```

Use JSON output for automation:

```sh
ur -p --output-format json "list the main commands"
```

Resume a recent session:

```sh
ur --continue
ur --resume
```

Run with a specific model:

```sh
ur --model qwen2.5-coder:latest
```

See all CLI options and subcommands:

```sh
ur --help
ur mcp --help
ur plugin --help
```

## Documentation

- [Usage Guide](docs/USAGE.md)
- [Configuration](docs/CONFIGURATION.md)
- [Development Guide](docs/DEVELOPMENT.md)

The `examples/` directory also contains prompt examples for coding, research, browser, image, video, MCP, and memory workflows.

## Project Context

UR reads project instructions from `CLAUDE.md` files and can load project assets from `.ur/`. Shared project configuration may be committed, but local files such as `.ur/settings.local.json`, `.ur/memory/`, `.ur/index/`, and `CLAUDE.local.md` are ignored by Git.

## Development

```sh
bun run dev
bun run typecheck
bun test
bun run build
```

The package is marked `"private": true`, so it is ready for GitHub source sharing but not configured for npm publishing.

## Designed By
Maitham Al-rubaye
