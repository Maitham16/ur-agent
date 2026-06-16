import type { ModelOption } from './modelOptions.js'

const DEFAULT_BASE_URL = 'http://127.0.0.1:11434'

export function getOllamaBaseUrl(): string {
  const raw =
    process.env.OLLAMA_BASE_URL || process.env.OLLAMA_HOST || DEFAULT_BASE_URL
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`
  return withProtocol.replace(/\/+$/, '')
}

export function parseOllamaModelNames(value: unknown): string[] {
  if (!value || typeof value !== 'object' || !('models' in value)) {
    return []
  }
  const models = (value as { models?: unknown }).models
  if (!Array.isArray(models)) {
    return []
  }
  const names = models.flatMap(model => {
    if (!model || typeof model !== 'object') {
      return []
    }
    const entry = model as { name?: unknown; model?: unknown }
    const name = typeof entry.name === 'string' ? entry.name : entry.model
    if (typeof name !== 'string') {
      return []
    }
    const trimmed = name.trim()
    return trimmed ? [trimmed] : []
  })
  return [...new Set(names)].sort((a, b) => a.localeCompare(b))
}

export async function listOllamaModelNames(
  signal?: AbortSignal,
): Promise<string[]> {
  const response = await fetch(`${getOllamaBaseUrl()}/api/tags`, {
    signal,
    headers: process.env.OLLAMA_API_KEY
      ? { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` }
      : undefined,
  })
  if (!response.ok) {
    return []
  }
  return parseOllamaModelNames(await response.json())
}

export async function getOllamaModelOptions(
  signal?: AbortSignal,
): Promise<ModelOption[]> {
  const names = await listOllamaModelNames(signal)
  return names.map(name => ({
    value: name,
    label: name,
    description: 'Installed Ollama model',
  }))
}

export function mergeModelOptions(
  baseOptions: ModelOption[],
  extraOptions: ModelOption[],
): ModelOption[] {
  const result = [...baseOptions]
  const seen = new Set(result.map(option => option.value))
  for (const option of extraOptions) {
    if (!seen.has(option.value)) {
      result.push(option)
      seen.add(option.value)
    }
  }
  return result
}
