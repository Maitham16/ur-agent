# Configuration

UR reads configuration from CLI flags, environment variables, and project or user settings files.

## Model Provider

This checkout is configured to use the Ollama-compatible provider path. The default request endpoint is:

```text
http://127.0.0.1:11434
```

Common environment variables:

```sh
OLLAMA_MODEL=qwen2.5-coder:latest
UR_MODEL=qwen2.5-coder:latest
OLLAMA_HOST=http://127.0.0.1:11434
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_API_KEY=...
```

`OLLAMA_MODEL` takes precedence over `UR_MODEL`.

## CLI Flags

Frequently used flags:

```sh
ur --model <model>
ur --settings <file-or-json>
ur --add-dir <path>
ur --mcp-config <file-or-json>
ur --permission-mode <mode>
ur --plugin-dir <path>
ur --agents '<json>'
```

Use `ur --help` for the complete list.

## Settings Files

UR supports user, project, and local settings. Project-shared settings can live under `.ur/`, while local files should remain private.

Recommended Git behavior:

- Commit shared docs, skills, agents, and project settings that are safe for teammates.
- Do not commit `.ur/settings.local.json`.
- Do not commit generated `.ur/index/`, `.ur/memory/`, `.ur/cache/`, `.ur/tmp/`, or `.ur/logs/`.
- Do not commit `CLAUDE.local.md`.

## MCP Servers

Use the `mcp` subcommand to manage Model Context Protocol servers:

```sh
ur mcp list
ur mcp get <name>
ur mcp add-json <name> '<json>'
ur mcp remove <name>
```

MCP servers may execute code or access external services. Only enable servers you trust, and keep credentials out of committed config.

## Plugins and Skills

Plugins can add commands, tools, and skills:

```sh
ur plugin list
ur plugin install <plugin>
ur plugin update <plugin>
ur plugin disable <plugin>
```

Skills can be stored in `.ur/skills/` for project-specific workflows or in `~/.ur/skills/` for personal workflows.

## Secrets

Keep secrets in environment variables, local settings, a secret manager, or your shell profile. Never commit API keys, OAuth tokens, private keys, service-account JSON, or `.env` files.
