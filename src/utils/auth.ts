export function getSubscriptionType(): string | null { return null; }
export function isURAISubscriber(): boolean { return false; }
export function isMaxSubscriber(): boolean { return false; }
export function isProSubscriber(): boolean { return false; }
export function isTeamPremiumSubscriber(): boolean { return false; }
export function isUsing3PServices(): boolean { return false; }
export function getOauthProfile(): any { return null; }
export function isAuthenticated(): boolean { return false; }

export function hasProfileScope(): boolean { return false; }
export function getOauthAccountInfo(): any { return null; }
export function clearOAuthTokenCache(): void {}
export function checkAndRefreshOAuthTokenIfNeeded(): Promise<void> { return Promise.resolve(); }
export function handleOAuth401Error(...args: any[]): Promise<boolean> { return Promise.resolve(false); }
export function isURHQAuthEnabled(): boolean { return false; }
export function isOverageProvisioningAllowed(): boolean { return false; }
export function hasURHQApiKeyAuth(): boolean { return false; }
export function isConsumerSubscriber(): boolean { return false; }
export function getRateLimitTier(): string { return 'free'; }
export function getURHQApiKeyWithSource(...args: any[]): any { return { source: 'none' }; }
export function getApiKeyFromApiKeyHelper(...args: any[]): any { return { source: 'none' }; }
export function prefetchAwsCredentialsAndBedRockInfoIfSafe(): void {}
export function prefetchGcpCredentialsIfSafe(): void {}
export function validateForceLoginOrg(...args: any[]): Promise<{valid: boolean, message?: string}> { return Promise.resolve({valid: true}); }
export function getURAIOAuthTokens(): any { return null; }
export function clearApiKeyHelperCache(): void {}
export function clearAwsCredentialsCache(): void {}
export function clearGcpCredentialsCache(): void {}
export function getURHQApiKey(): any { return undefined; }
export function getAuthTokenSource(...args: any[]): any { return { source: 'none' }; }
export function getApiKeyFromConfigOrMacOSKeychain(...args: any[]): any { return undefined; }
export function getOtelHeadersFromHelper(): any { return {}; }
export function is1PApiCustomer(): boolean { return false; }
export function refreshAndGetAwsCredentials(): any { return null; }
export function refreshAndGetGcpCredentials(): any { return null; }
export function removeApiKey(): void {}
export function getAccountInformation(): any { return null; }
export function isTeamSubscriber(): boolean { return false; }
export function isEnterpriseSubscriber(): boolean { return false; }
export function saveOAuthTokensIfNeeded(): void {}
export function getApiKeyHelperElapsedMs(): number { return 0; }
export function getConfiguredApiKeyHelper(): any { return null; }
export function prefetchApiKeyFromApiKeyHelperIfSafe(): void {}
