export const SESSION_TOKEN_PATH = '/run/ccr/session_token'

export async function initUpstreamProxy(opts?: {
  tokenPath?: string
  systemCaPath?: string
  caBundlePath?: string
  ccrBaseUrl?: string
}): Promise<{ enabled: boolean }> {
  return { enabled: false }
}

export function getUpstreamProxyEnv(): Record<string, string> {
  return {}
}

export function resetUpstreamProxyForTests(): void {}
