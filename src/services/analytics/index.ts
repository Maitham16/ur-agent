export type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS = any;
export type AnalyticsMetadata_I_VERIFIED_THIS_IS_PII_TAGGED = any;

export function logEvent(name: string, metadata?: any): void {}
export function logEventAsync(name: string, metadata?: any): Promise<void> { return Promise.resolve(); }
export function flushAnalytics(): Promise<void> { return Promise.resolve(); }
export function initializeAnalytics(): void {}
export function attachAnalyticsSink(...args: any[]): void {}
export function stripProtoFields(...args: any[]): any { return {}; }
