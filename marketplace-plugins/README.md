# marketplace-plugins/

First-party plugins for the **ur-plugins-official** marketplace.

Each subdirectory here is a self-contained plugin. The marketplace
manifest at `.ur-plugin/marketplace.json` (at the repo root) lists which of
them are published.

## Adding a new plugin

1. Copy `hello/` to a new directory, e.g. `marketplace-plugins/my-plugin/`.
2. Edit `my-plugin/.ur-plugin/plugin.json` with the plugin's real metadata.
3. Replace the example command in `my-plugin/commands/` with your own.
4. Add an entry to `.ur-plugin/marketplace.json` (sibling to existing
   entries).
5. Open a PR against `Maitham16/ur-agent`.

See [`hello/README.md`](./hello/README.md) for the smallest possible example.

## Schemas

The shapes for `marketplace.json` and `plugin.json` are defined in the
agent source — see `src/utils/plugins/schemas.ts` (`PluginMarketplaceSchema`
and `PluginManifestSchema`). The schemas are strict-by-default but
unknown fields on marketplace entries are silently stripped so future
versions stay forward-compatible.
