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
