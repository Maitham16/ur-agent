import { expect, test } from 'bun:test'
import {
  getOllamaBaseUrl,
  mergeModelOptions,
  parseOllamaModelNames,
} from '../src/utils/model/ollamaModels.js'
import type { ModelOption } from '../src/utils/model/modelOptions.js'

test('parseOllamaModelNames returns sorted unique model names', () => {
  expect(
    parseOllamaModelNames({
      models: [
        { name: 'qwen2.5-coder:latest' },
        { model: 'llama3.2:latest' },
        { name: 'qwen2.5-coder:latest' },
        { name: '  mistral:7b  ' },
        { name: '' },
        {},
      ],
    }),
  ).toEqual(['llama3.2:latest', 'mistral:7b', 'qwen2.5-coder:latest'])
})

test('getOllamaBaseUrl normalizes host environment values', () => {
  const originalBase = process.env.OLLAMA_BASE_URL
  const originalHost = process.env.OLLAMA_HOST
  try {
    delete process.env.OLLAMA_BASE_URL
    process.env.OLLAMA_HOST = '127.0.0.1:11434/'
    expect(getOllamaBaseUrl()).toBe('http://127.0.0.1:11434')
    process.env.OLLAMA_BASE_URL = 'https://ollama.example.test/'
    expect(getOllamaBaseUrl()).toBe('https://ollama.example.test')
  } finally {
    if (originalBase === undefined) {
      delete process.env.OLLAMA_BASE_URL
    } else {
      process.env.OLLAMA_BASE_URL = originalBase
    }
    if (originalHost === undefined) {
      delete process.env.OLLAMA_HOST
    } else {
      process.env.OLLAMA_HOST = originalHost
    }
  }
})

test('mergeModelOptions appends only missing model values', () => {
  const base: ModelOption[] = [
    { value: null, label: 'Default', description: 'Default model' },
    { value: 'llama3.2:latest', label: 'llama3.2:latest', description: 'Current model' },
  ]
  const extra: ModelOption[] = [
    {
      value: 'llama3.2:latest',
      label: 'llama3.2:latest',
      description: 'Installed Ollama model',
    },
    {
      value: 'qwen2.5-coder:latest',
      label: 'qwen2.5-coder:latest',
      description: 'Installed Ollama model',
    },
  ]
  expect(mergeModelOptions(base, extra)).toEqual([
    base[0],
    base[1],
    extra[1],
  ])
})
