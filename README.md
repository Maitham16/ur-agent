# UR Agent

![Archived](https://img.shields.io/badge/status-ARCHIVED-red?style=for-the-badge)
![Moved](https://img.shields.io/badge/development-MOVED_TO_NEW_REPOSITORY-blue?style=for-the-badge)

> [!WARNING]
> **This repository is archived and no longer maintained.**
> The project has moved to a new official repository.

UR Agent is now a **modern Bun/TypeScript terminal coding agent** with **top-tier features** designed to compete with leading coding agents.

It supports:

* **Project context**
* **Slash commands**
* **MCP server integration**
* **Plugins**
* **Skills**
* **Custom agents**
* **Advanced agent workflows**

This repository contains an **old implementation** from the early development phase.

Since then, UR Agent has been **fully redesigned and rebuilt** with an **independent architecture**, moving far away from the original core. For this reason, this repository is kept only for **historical reference**.

## Active Repository

The latest version, updates, documentation, and active development are available here:

**https://github.com/Maitham16/UR-mapek**

======================================================================================================
# UR Agent

UR is a Bun/TypeScript terminal coding agent. It starts an interactive session by default, can run once in print mode for scripts, and supports project context, slash commands, MCP servers, plugins, skills, and custom agents.

The package installs a global `ur` command from this GitHub repository. The launcher requires Bun and sets an Ollama-compatible default model if no model is provided.

## Requirements

- Bun. This workspace was verified with Bun 1.3.14.
- Node.js-compatible shell environment
- An Ollama-compatible server for model requests
- Optional: GitHub CLI, tmux, and IDE integrations for workflows that use them

## Install

### IMPORTANT
If you have previous version remove it with:

```sh
npm uninstall -g ur-agent
bun remove -g ur-agent
```

### Then, install:

```sh
bun add -g github:Maitham16/ur-agent
ur --version
ur
```

If you prefer npm for the global install, Bun is still required at runtime:

```sh
npm install -g github:Maitham16/ur-agent
ur --version
```

If the default model is not available, choose a model explicitly:

```sh
UR_MODEL=qwen2.5-coder:latest ur
```

The launch wrapper reads `OLLAMA_MODEL` first, then `UR_MODEL`, and otherwise falls back to `kimi-k2.7-code:cloud`.

## Development From Source

```sh
bun install
bun run start
```

To make the `ur` command available from this checkout during development:

```sh
bun link
ur
```

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

## License And Responsibility

UR Agent is released under the [UR Agent Non-Commercial Self-Responsibility License](LICENSE). Commercial use is not allowed without written permission from Maitham Al-rubaye.

The software is provided as-is. Users are responsible for reviewing how they run it, what tools it can access, and any outputs or actions it creates.

## Security

Do not commit secrets, passwords, API keys, OAuth tokens, private keys, `.env` files, local UR memory, generated indexes, logs, or local settings. The package `files` list ships only the runtime source, launcher, docs, examples, and license.

## Project Context

UR reads project instructions from `UR.md` files and can load project assets from `.ur/`. Shared project configuration may be committed, but local files such as `.ur/settings.local.json`, `.ur/memory/`, `.ur/index/`, and `UR.local.md` are ignored by Git.

## Development

```sh
bun run dev
bun test
bun run smoke
npm pack --dry-run
bun run build
```

The package is configured for GitHub installation through `github:Maitham16/ur-agent`. It is not published to the npm registry yet.

## Designed By

Maitham Al-rubaye
