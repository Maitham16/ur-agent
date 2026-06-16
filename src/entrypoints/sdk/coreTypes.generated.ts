// Reconstructed permissive SDK core types.
// The leaked source stubbed the generated file; these definitions match the
// observed usage so consumers compile without runtime change.

type AnyObject = Record<string, unknown>

export type ModelUsage = {
  inputTokens: number
  outputTokens: number
  cacheReadInputTokens: number
  cacheCreationInputTokens: number
  webSearchRequests: number
  costUSD: number
  contextWindow: number
  maxOutputTokens: number
}

export type OutputFormatType = 'json_schema'

export type BaseOutputFormat = {
  type: OutputFormatType
}

export type JsonSchemaOutputFormat = {
  type: 'json_schema'
  schema: Record<string, unknown>
}

export type OutputFormat = JsonSchemaOutputFormat

export type ApiKeySource = 'user' | 'project' | 'org' | 'temporary' | 'oauth'
export type ConfigScope = 'local' | 'user' | 'project'

export type SdkBeta = 'context-1m-2025-08-07'

export type ThinkingAdaptive = { type: 'adaptive' }
export type ThinkingEnabled = { type: 'enabled'; budgetTokens?: number }
export type ThinkingDisabled = { type: 'disabled' }
export type ThinkingConfig = ThinkingAdaptive | ThinkingEnabled | ThinkingDisabled

export type PermissionMode =
  | 'default'
  | 'acceptEdits'
  | 'bypassPermissions'
  | 'plan'
  | 'dontAsk'

export type HookEventName = string
export type HookEvent = HookEventName

export type SDKExitReason =
  | 'clear'
  | 'resume'
  | 'logout'
  | 'prompt_input_exit'
  | 'other'
  | 'bypass_permissions_disabled'

export type SDKMessageBase = {
  type?: string
  uuid?: string
  session_id?: string
  parent_tool_use_id?: string | null
  [key: string]: unknown
}

export type SDKUserMessage = SDKMessageBase & {
  type: 'user'
  message: AnyObject
}

export type SDKAssistantMessage = SDKMessageBase & {
  type: 'assistant'
  message: AnyObject
}

export type SDKAssistantMessageError = SDKMessageBase & {
  type: 'assistant'
  subtype: 'error'
  error: { message: string; type?: string }
}

export type SDKSystemMessage = SDKMessageBase & {
  type: 'system'
  subtype?: string
}

export type SDKResultSuccess = SDKMessageBase & {
  type: 'result'
  subtype: 'success'
  result: string
  duration_ms: number
  duration_api_ms: number
  num_turns: number
  is_error: false
  session_id: string
  total_cost_usd?: number
  usage?: ModelUsage
}

export type SDKResultError = SDKMessageBase & {
  type: 'result'
  subtype: 'error_max_turns' | 'error_during_execution' | 'error'
  is_error: true
  duration_ms: number
  duration_api_ms: number
  num_turns: number
  session_id: string
  result?: string
}

export type SDKResultMessage = SDKResultSuccess | SDKResultError

export type SDKMessage =
  | SDKUserMessage
  | SDKAssistantMessage
  | SDKAssistantMessageError
  | SDKSystemMessage
  | SDKResultMessage

export type SDKSessionInfo = {
  session_id: string
  uuid?: string
  created_at?: string
  updated_at?: string
  cwd?: string
  model?: string
  title?: string
  [key: string]: unknown
}

export type SDKSession = SDKSessionInfo & {
  messages?: SDKMessage[]
}

// Catch-all permissive aliases used by various SDK callsites.
export type SDKOptions = AnyObject
export type SDKConfig = AnyObject
export type SDKQueryOptions = AnyObject
export type SDKQueryResult = AnyObject
export type SDKQuery = AnyObject
