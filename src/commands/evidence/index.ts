import type { Command } from '../../types/command.js'
import type { ContentBlockParam } from '@urhq-ai/sdk/resources/index.mjs'

const evidenceCmd: Command = {
  type: 'prompt',
  name: 'evidence',
  description: 'Manage or view evidence records',
  argumentHint: '<task>',
  progressMessage: 'analyzing evidence request',
  contentLength: 0,
  source: 'builtin',
  async getPromptForCommand(args: string): Promise<ContentBlockParam[]> {
    return [
      {
        type: 'text',
        text: `The user wants you to manage evidence: ${args || 'Please analyze the workspace and gather evidence of actions.'}\nPlease read or write the evidence logs securely.`,
      },
    ]
  },
}
export default evidenceCmd
