# UR 1.5.0 Implementation Plan

## 1. Files to Copy Unchanged
*   `plugins/**` (Keep all local plugins, as per rules)
*   `docs/**`, `examples/**`, `test/**` (Except tests specifically targeting Anthropic API, which may be removed or updated, but generally copy unchanged)
*   `marketplace-plugins/**` (Marketplace functionality is preserved)
*   `src/tools/**` (Except specific files mentioned below that have external auth or AI logic)
*   Most files in `src/utils/`, `src/components/`, `src/ur/`, `src/services/` that do not contain hardcoded Anthropic logic, symbols, or external network dependencies.

## 2. Files to Modify Minimally
*   `package.json`: Remove dependencies for `@anthropic-ai/*`, `@aws-sdk/*`, `@azure/identity`, `google-auth-library`.
*   `src/main.tsx`: Remove Claude/Anthropic auth, APIs, telemetry logic, Anthropic telemetry endpoint, Claude desktop integrations. Ensure default provider is `ollama`. Remove flags like `--claudeai`.
*   `src/ur/sysinfo.ts`: Restrict Ollama health check to localhost only. Remove `--ollama-url` logic.
*   `src/upstreamproxy/upstreamproxy.ts`: Remove anthropic/claude proxy configs.
*   `src/utils/model/model.ts`, `src/utils/model/providers.ts`, `src/utils/model/ollamaModels.ts`: Hardcode `http://localhost:11434/api`. Remove Anthropic, Bedrock, Vertex, Foundry models. Only allow Ollama local.
*   `src/utils/auth.ts` / `src/utils/auth.js`: Remove all Anthropic API key logic, OAuth flow, and external SSO logic.
*   `src/constants/prompts.ts`: Remove Anthropic-specific prompt sections, ensure Ollama logic is standard.
*   `src/components/messages/SystemTextMessage.tsx`, `src/components/Passes/Passes.tsx`, `src/components/Spinner.tsx`: Replace `TEARDROP_ASTERISK` with `UR_HOUSE_SYMBOL` (or `AnimatedHouse`).
*   `src/constants/figures.ts`: Remove `TEARDROP_ASTERISK` and add `UR_HOUSE_SYMBOL` (square body with two roof lines forming a triangle).
*   `src/tools/AgentTool/built-in/urCodeGuideAgent.ts`: Update guide text to remove all references to Anthropic API, Claude models, replacing with "UR local models via Ollama".
*   `src/tools/PowerShellTool/pathValidation.ts` \u0026 `src/tools/PowerShellTool/powershellPermissions.ts`: Remove `ANTHROPIC_API_KEY` leak check (or replace with local checks if needed, but since it's local, no external key needed).
*   `src/tools/WebFetchTool/preapproved.ts`, `src/tools/WebFetchTool/utils.ts`: Remove Anthropic-specific exceptions and API calls.
*   `src/Tool.ts`: Modify imports so it doesn't depend on `@anthropic-ai/sdk` if the sdk is removed, or if we keep the types, use local generic types.

## 3. Files to Rename
*   `src/components/LogoV2/AnimatedAsterisk.tsx` -\u003e `src/components/LogoV2/AnimatedHouse.tsx`

## 4. Files to Replace with Original UR Implementation
*   `src/services/api/client.ts`: Replace complex multi-provider (Anthropic/AWS/GCP/Azure) auth routing with a clean implementation that only returns the Ollama client targeting `http://localhost:11434/api`.
*   `src/components/LogoV2/AnimatedHouse.tsx` (formerly `AnimatedAsterisk.tsx`): Implement the new animation showing the UR house being built (square body + two roof lines forming a triangle).

## 5. Files to Remove with Exact Reason
*   `src/services/api/claude.ts`: Removed because the Anthropic/Claude backend is completely forbidden.
*   `src/services/oauth/**` (and any related OAuth/grove files): Removed because cloud/OAuth auth is forbidden and unnecessary for local Ollama.
*   `src/components/LogoV2/VoiceModeNotice.tsx`, `src/components/LogoV2/Opus1mMergeNotice.tsx`: Removed because they are specific to Claude/Opus feature announcements that are irrelevant and forbidden.

## 6. References That Must Be Updated
*   All imports of `AnimatedAsterisk` updated to `AnimatedHouse`.
*   All instances of `TEARDROP_ASTERISK` updated to `UR_HOUSE_SYMBOL`.
*   All references to `getAnthropicClient` updated to refer to the simplified `getClient` or `getOllamaClient`.
*   All Anthropic-specific environment variables (`ANTHROPIC_API_KEY`, `CLAUDE_API_KEY`, `OPENAI_API_KEY`) removed from validation schemas and docs.
*   All references to model names (`claude-*`, `sonnet`, `opus`, `haiku`, etc.) removed from the allowed model lists.

## 7. Backend Changes Needed
*   Remove all network calls to Anthropic, AWS, Azure, Google Cloud.
*   Ensure Ollama API calls are strictly routed to `http://localhost:11434/api` only.
*   Reject or remove configuration flags that allow overriding the Ollama host (e.g., `--ollama-url`, `OLLAMA_HOST`, `OLLAMA_BASE_URL` pointing outside localhost).

## 8. Symbol/Logo Changes Needed
*   Keep "UR" product identity and text logo.
*   Change `TEARDROP_ASTERISK` to `UR_HOUSE_SYMBOL`.
*   Create a text-based animation of a house being built (square base, then roof) for the thinking/processing state in `AnimatedHouse.tsx`. Do not use old-logo, Clawd, AnimatedAsterisk, or old asterisk-symbol components.

## 9. Plugin/Search/Browser Rules to Preserve
*   Do NOT remove or disable `marketplace-plugins`, `plugins`, `WebSearchTool`, `WebFetchTool`.
*   Internet/search/browser/marketplace are allowed only by explicit user action.
*   Remove Anthropic-specific hardcoded exclusions/inclusions from `WebFetchTool` so that it functions independently without telemetry or vendor lock-in.

## 10. Exact Implementation Order
1.  **Scaffold**: Copy the `1.4.3 (UR)` directory contents to `UR-1.5.0` as the baseline.
2.  **Remove**: Delete forbidden files (`claude.ts`, OAuth services, Opus/Claude specific notices).
3.  **Rename \u0026 Logo**: Rename `AnimatedAsterisk.tsx` to `AnimatedHouse.tsx`. Define `UR_HOUSE_SYMBOL` in `figures.ts` and replace `TEARDROP_ASTERISK` everywhere. Implement the house-building animation.
4.  **Dependencies**: Strip all external AI SDKs from `package.json` (`@anthropic-ai/*`, AWS, Azure, Google auth).
5.  **Backend**: Rewrite `client.ts` to strictly return a local Ollama client. Hardcode `http://localhost:11434/api` in `ollama.ts` and `ollamaModels.ts`. Remove all other model providers.
6.  **Cleanup**: Strip Anthropic flags, auth checks, and telemetry from `main.tsx`, `urCodeGuideAgent.ts`, and `upstreamproxy.ts`. Ensure no hidden network calls exist.
