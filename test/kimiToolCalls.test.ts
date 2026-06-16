import { expect, test } from 'bun:test'
import {
  parseBareJsonToolCalls,
  parseTextToolCalls,
} from '../src/cli/transports/kimiToolCalls.ts'
import { synthesizeKimiToolCalls } from '../src/cli/transports/ccrClient.ts'

test('bare TaskCreate JSON is converted when the tool is available', () => {
  const result = parseBareJsonToolCalls(
    'Planning\n{"subject":"Create project structure","description":"Set up HTML, CSS, and JS files"}\nNext\n',
    {
      availableToolNames: new Set(['TaskCreate']),
      parseBareJsonToolCalls: true,
    },
  )

  expect(result.text).toBe('Planning\nNext\n')
  expect(result.toolCalls).toHaveLength(1)
  expect(result.toolCalls[0]!.name).toBe('TaskCreate')
  expect(result.toolCalls[0]!.input).toEqual({
    subject: 'Create project structure',
    description: 'Set up HTML, CSS, and JS files',
  })
})

test('bare Write JSON is converted when the tool is available', () => {
  const result = parseBareJsonToolCalls(
    '{"file_path":"/tmp/game.js","content":"const title = \\"Mario\\";\\nconsole.log(title);"}\n',
    {
      availableToolNames: new Set(['Write']),
      parseBareJsonToolCalls: true,
    },
  )

  expect(result.text).toBe('')
  expect(result.toolCalls).toHaveLength(1)
  expect(result.toolCalls[0]!.name).toBe('Write')
  expect(result.toolCalls[0]!.input).toEqual({
    file_path: '/tmp/game.js',
    content: 'const title = "Mario";\nconsole.log(title);',
  })
})

test('loose Write JSON with unescaped content quotes is recovered', () => {
  const result = parseBareJsonToolCalls(
    '{"file_path":"/tmp/package.json","content":"{\\n  "name": "mario-one-level"\\n}"}\n',
    {
      availableToolNames: new Set(['Write']),
      parseBareJsonToolCalls: true,
    },
  )

  expect(result.text).toBe('')
  expect(result.toolCalls).toHaveLength(1)
  expect(result.toolCalls[0]!.input).toEqual({
    file_path: '/tmp/package.json',
    content: '{\n  "name": "mario-one-level"\n}',
  })
})

test('multiline loose Write JSON is recovered as one tool call', () => {
  const result = parseBareJsonToolCalls(
    `{"file_path": "/tmp/mario.html", "content": "\\n<html lang="en">\\n<style>\\nbody { margin: 0; }\\ncanvas { width: 960px; }\\n</style>\\n<script>\\nconst level = { width: 320 };\\nfunction draw() { ctx.fillRect(0, 0, 1, 1); }\\n</script>\\n"}`,
    {
      availableToolNames: new Set(['Write']),
      parseBareJsonToolCalls: true,
    },
  )

  expect(result.text).toBe('')
  expect(result.toolCalls).toHaveLength(1)
  expect(result.toolCalls[0]!.name).toBe('Write')
  expect(result.toolCalls[0]!.input).toEqual({
    file_path: '/tmp/mario.html',
    content:
      '\n<html lang="en">\n<style>\nbody { margin: 0; }\ncanvas { width: 960px; }\n</style>\n<script>\nconst level = { width: 320 };\nfunction draw() { ctx.fillRect(0, 0, 1, 1); }\n</script>\n',
  })
})

test('multiline loose Write JSON after prose is recovered', () => {
  const result = parseTextToolCalls(
    `Approved. I'll create the game now.\n{"file_path": "/tmp/mario.html", "content": "\\n<html lang="en">\\n<style>\\nbody { margin: 0; }\\n</style>\\n"}`,
    {
      availableToolNames: new Set(['Write']),
      parseBareJsonToolCalls: true,
    },
  )

  expect(result.text).toBe("Approved. I'll create the game now.\n")
  expect(result.toolCalls).toHaveLength(1)
  expect(result.toolCalls[0]!.name).toBe('Write')
  expect(result.toolCalls[0]!.input.file_path).toBe('/tmp/mario.html')
})

test('remote transport synthesizes bare Write JSON into a tool use', () => {
  const message = {
    message: {
      content: [
        {
          type: 'text',
          text: `Approved. I'll create the game now.\n{"file_path": "/tmp/mario.html", "content": "\\n<html lang="en">\\n<style>\\nbody { margin: 0; }\\n</style>\\n"}`,
        },
      ],
      stop_reason: 'end_turn',
    },
  }

  synthesizeKimiToolCalls(message)

  expect(message.message.stop_reason).toBe('tool_use')
  expect(message.message.content).toHaveLength(2)
  expect(message.message.content[0]).toEqual({
    type: 'text',
    text: "Approved. I'll create the game now.\n",
  })
  expect(message.message.content[1]).toMatchObject({
    type: 'tool_use',
    name: 'Write',
    input: {
      file_path: '/tmp/mario.html',
      content: '\n<html lang="en">\n<style>\nbody { margin: 0; }\n</style>\n',
    },
  })
})

test('bare JSON remains text when the matching tool is unavailable', () => {
  const text =
    '{"file_path":"/tmp/game.js","content":"console.log(1)"}\n'
  const result = parseBareJsonToolCalls(text, {
    availableToolNames: new Set(['TaskCreate']),
    parseBareJsonToolCalls: true,
  })

  expect(result.text).toBe(text)
  expect(result.toolCalls).toHaveLength(0)
})

test('Kimi markup and bare JSON are both parsed', () => {
  const result = parseTextToolCalls(
    '<|tool_call_begin|>functions.Write:0<|tool_call_argument_begin|>{"file_path":"/tmp/a.js","content":"a"}<|tool_call_end|>\n{"file_path":"/tmp/b.js","content":"b"}\n',
    {
      availableToolNames: new Set(['Write']),
      parseBareJsonToolCalls: true,
    },
  )

  expect(result.text).toBe('')
  expect(result.toolCalls.map(call => call.name)).toEqual(['Write', 'Write'])
  expect(result.toolCalls.map(call => call.input.file_path)).toEqual([
    '/tmp/a.js',
    '/tmp/b.js',
  ])
})
