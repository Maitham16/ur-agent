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
