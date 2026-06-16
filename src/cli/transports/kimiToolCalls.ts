export interface ParsedToolCall {
  id: string
  name: string
  input: Record<string, unknown>
}

export interface KimiParseResult {
  text: string
  toolCalls: ParsedToolCall[]
}

type ToolNameCollection = ReadonlySet<string> | string[]

export interface TextToolCallParseOptions {
  availableToolNames?: ToolNameCollection
  parseBareJsonToolCalls?: boolean
}

const SECTION_RE = /<\|tool_calls_section_begin\|>([\s\S]*?)<\|tool_calls_section_end\|>/g
const CALL_RE = /<\|tool_call_begin\|>([\s\S]*?)<\|tool_call_argument_begin\|>([\s\S]*?)<\|tool_call_end\|>/g
const STRAY_RE = /<\|tool_calls?_section_(?:begin|end)\|>|<\|tool_call_(?:begin|end|argument_begin)\|>/g

function parseArgs(raw: string): Record<string, unknown> {
  const s = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  try {
    const v = JSON.parse(s)
    return v && typeof v === 'object' ? (v as Record<string, unknown>) : {}
  } catch {
    try {
      return JSON.parse(s.replace(/,\s*([}\]])/g, '$1')) as Record<string, unknown>
    } catch {
      return {}
    }
  }
}

export function parseKimiToolCalls(text: string): KimiParseResult {
  if (!text || !text.includes('<|tool_call')) return { text, toolCalls: [] }
  const toolCalls: ParsedToolCall[] = []
  let i = 0
  CALL_RE.lastIndex = 0
  let cleaned = text.replace(CALL_RE, (_full, rawName: string, rawArgs: string) => {
    const name = (rawName ?? '').trim().replace(/^functions\./, '').replace(/[:.]\d+\s*$/, '').trim()
    if (name) toolCalls.push({ id: `kimi_${Date.now().toString(36)}_${i++}`, name, input: parseArgs(rawArgs ?? '') })
    return ''
  })
  cleaned = cleaned.replace(SECTION_RE, '').replace(STRAY_RE, '').replace(/\n{3,}/g, '\n\n').trim()
  return { text: cleaned, toolCalls }
}

function hasTool(
  availableToolNames: ToolNameCollection | undefined,
  name: string,
): boolean {
  if (!availableToolNames) return false
  return Array.isArray(availableToolNames)
    ? availableToolNames.includes(name)
    : availableToolNames.has(name)
}

function sameKeys(
  value: Record<string, unknown>,
  required: string[],
  optional: string[] = [],
): boolean {
  const allowed = new Set([...required, ...optional])
  const keys = Object.keys(value)
  return (
    required.every(key => Object.prototype.hasOwnProperty.call(value, key)) &&
    keys.every(key => allowed.has(key))
  )
}

function parseJsonishString(raw: string): string {
  try {
    return JSON.parse(`"${raw}"`) as string
  } catch {
    return raw
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
  }
}

function parseLooseWriteObject(trimmed: string): Record<string, unknown> | null {
  const match = trimmed.match(
    /^\{\s*"file_path"\s*:\s*"((?:\\.|[^"\\])*)"\s*,\s*"content"\s*:\s*"([\s\S]*)"\s*\}$/,
  )
  if (!match) return null
  return {
    file_path: parseJsonishString(match[1] ?? ''),
    content: parseJsonishString(match[2] ?? ''),
  }
}

function parseLooseEditObject(trimmed: string): Record<string, unknown> | null {
  const match = trimmed.match(
    /^\{\s*(?:"replace_all"\s*:\s*(true|false)\s*,\s*)?"file_path"\s*:\s*"((?:\\.|[^"\\])*)"\s*,\s*"old_string"\s*:\s*"([\s\S]*?)"\s*,\s*"new_string"\s*:\s*"([\s\S]*)"\s*(?:,\s*"replace_all"\s*:\s*(true|false))?\s*\}$/,
  )
  if (!match) return null
  return {
    file_path: parseJsonishString(match[2] ?? ''),
    old_string: parseJsonishString(match[3] ?? ''),
    new_string: parseJsonishString(match[4] ?? ''),
    ...(match[1] !== undefined || match[5] !== undefined
      ? { replace_all: (match[1] ?? match[5]) === 'true' }
      : {}),
  }
}

function parseJsonObject(text: string): Record<string, unknown> | null {
  const trimmed = text.trim()
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return null
  try {
    const value = JSON.parse(trimmed)
    return value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null
  } catch {
    return parseLooseWriteObject(trimmed) ?? parseLooseEditObject(trimmed)
  }
}

function maybeBareJsonToolCall(
  text: string,
  availableToolNames: ToolNameCollection | undefined,
  index: number,
): ParsedToolCall | null {
  const input = parseJsonObject(text)
  if (!input) return null

  if (
    hasTool(availableToolNames, 'TaskCreate') &&
    sameKeys(input, ['subject', 'description'], ['activeForm', 'metadata']) &&
    typeof input.subject === 'string' &&
    typeof input.description === 'string' &&
    (input.activeForm === undefined || typeof input.activeForm === 'string') &&
    (input.metadata === undefined ||
      (typeof input.metadata === 'object' &&
        input.metadata !== null &&
        !Array.isArray(input.metadata)))
  ) {
    return { id: `bare_${Date.now().toString(36)}_${index}`, name: 'TaskCreate', input }
  }

  if (
    hasTool(availableToolNames, 'Write') &&
    sameKeys(input, ['file_path', 'content']) &&
    typeof input.file_path === 'string' &&
    typeof input.content === 'string'
  ) {
    return { id: `bare_${Date.now().toString(36)}_${index}`, name: 'Write', input }
  }

  if (
    hasTool(availableToolNames, 'Edit') &&
    sameKeys(input, ['file_path', 'old_string', 'new_string'], ['replace_all']) &&
    typeof input.file_path === 'string' &&
    typeof input.old_string === 'string' &&
    typeof input.new_string === 'string' &&
    (input.replace_all === undefined || typeof input.replace_all === 'boolean')
  ) {
    return { id: `bare_${Date.now().toString(36)}_${index}`, name: 'Edit', input }
  }

  return null
}

export function looksLikeBareJsonToolCallPrefix(text: string): boolean {
  const trimmed = text.trimStart()
  if (!trimmed.startsWith('{')) return false
  return (
    /"subject"\s*:/.test(trimmed) ||
    /"description"\s*:/.test(trimmed) ||
    /"file_path"\s*:/.test(trimmed) ||
    /"content"\s*:/.test(trimmed) ||
    /"old_string"\s*:/.test(trimmed) ||
    /"new_string"\s*:/.test(trimmed)
  )
}

export function parseBareJsonToolCalls(
  text: string,
  options: TextToolCallParseOptions,
): KimiParseResult {
  if (!text || !options.parseBareJsonToolCalls) return { text, toolCalls: [] }
  const wholeCall = maybeBareJsonToolCall(text, options.availableToolNames, 0)
  if (wholeCall) {
    return { text: '', toolCalls: [wholeCall] }
  }
  let offset = 0
  for (const line of text.match(/[^\n]*(?:\n|$)/g) ?? []) {
    if (line === '') break
    if (offset > 0) {
      const tail = text.slice(offset)
      if (looksLikeBareJsonToolCallPrefix(tail)) {
        const tailCall = maybeBareJsonToolCall(
          tail,
          options.availableToolNames,
          0,
        )
        if (tailCall) {
          return { text: text.slice(0, offset), toolCalls: [tailCall] }
        }
      }
    }
    offset += line.length
  }
  const toolCalls: ParsedToolCall[] = []
  let i = 0
  const cleaned = text.replace(/[^\n]*(?:\n|$)/g, line => {
    if (line === '') return line
    const call = maybeBareJsonToolCall(line, options.availableToolNames, i)
    if (!call) return line
    toolCalls.push(call)
    i++
    return ''
  })
  return { text: cleaned, toolCalls }
}

export function parseTextToolCalls(
  text: string,
  options: TextToolCallParseOptions = {},
): KimiParseResult {
  const kimi = parseKimiToolCalls(text)
  const bare = parseBareJsonToolCalls(kimi.text, options)
  return {
    text: bare.text,
    toolCalls: [...kimi.toolCalls, ...bare.toolCalls],
  }
}
