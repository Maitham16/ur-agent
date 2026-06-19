// @ts-nocheck
import type URHQ from '@urhq-ai/sdk';
import type { ClientOptions } from '@urhq-ai/sdk';

export const CLIENT_REQUEST_ID_HEADER = 'x-client-request-id';

export async function getURHQClient({
  apiKey,
  maxRetries,
  model,
  fetchOverride,
  source,
}: {
  apiKey?: string
  maxRetries: number
  model?: string
  fetchOverride?: ClientOptions['fetch']
  source?: string
}): Promise<URHQ> {
  const { createOllamaURHQClient } = await import('./ollama.js');
  return createOllamaURHQClient() as URHQ;
}
