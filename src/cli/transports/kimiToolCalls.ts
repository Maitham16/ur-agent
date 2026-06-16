// Parser for text-form tool calls emitted by some models (Kimi-K2 / Qwen
// "ChatML tools") when a backend doesn't return structured tool calls. The
// model writes a section like:
//
//   <|tool_calls_section_begin|>
//     <|tool_call_begin|>functions.write_file:0<|tool_call_argument_begin|>{"path":"app.js","content":"..."}<|tool_call_end|>
//   <|tool_calls_section_end|>
//
// We turn that into structured calls and strip it from the visible text so it
// neither corrupts output nor silently drops the action.

export interface ParsedToolCall {
  id: string
  name: string
  input: Record<string, unknown>
}

export interface KimiParseResult {
  /** Text with the tool-call section(s) removed. */
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

/** Best-effort JSON parse with a light repair for trailing commas / fences. */
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

/** Extract Kimi/ChatML text-form tool calls and return cleaned text + calls. */
export function parseKimiToolCalls(text: string): KimiParseResult {
  if (!text || !text.includes('<|tool_call')) return { text, toolCalls: [] }
  const toolCalls: ParsedToolCall[] = []
  let i = 0
  // Match each tool call anywhere — with OR without the surrounding
  // <|tool_calls_section_begin|>…<|tool_calls_section_end|> wrapper, since some
  // backends emit the inner call markers only.
  CALL_RE.lastIndex = 0
  let cleaned = text.replace(CALL_RE, (_full, rawName: string, rawArgs: string) => {
    const name = (rawName ?? '').trim().replace(/^functions\./, '').replace(/[:.]\d+\s*$/, '').trim()
    if (name) toolCalls.push({ id: `kimi_${Date.now().toString(36)}_${i++}`, name, input: parseArgs(rawArgs ?? '') })
    return ''
  })
  // Drop any remaining section/stray control tokens (incl. unpaired ones).
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

function parseJsonObjectLine(line: string): Record<string, unknown> | null {
  const trimmed = line.trim()
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return null
  try {
    const value = JSON.parse(trimmed)
    return value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null
  } catch {
    return parseLooseWriteObject(trimmed)
  }
}

function maybeBareJsonToolCall(
  line: string,
  availableToolNames: ToolNameCollection | undefined,
  index: number,
): ParsedToolCall | null {
  const input = parseJsonObjectLine(line)
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
