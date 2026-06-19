export type CachedMCState = any;
export type CacheEditsBlock = any;
export type PinnedCacheEdits = any;
export function createCachedMCState(): CachedMCState { return null; }
export function markToolsSentToAPI(state: CachedMCState): void {}
export function resetCachedMCState(state: CachedMCState): void {}
export function isCachedMicrocompactEnabled(): boolean { return false; }
export function isModelSupportedForCacheEditing(model: any): boolean { return false; }
export function getCachedMCConfig(): any { return {}; }
export function registerToolResult(state: CachedMCState, id: string): void {}
export function registerToolMessage(state: CachedMCState, ids: string[]): void {}
export function getToolResultsToDelete(state: CachedMCState): string[] { return []; }
export function createCacheEditsBlock(state: CachedMCState, tools: string[]): any { return null; }
