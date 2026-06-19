import type { Command } from '../../types/command.js'
import type { ContentBlockParam } from '@urhq-ai/sdk/resources/index.mjs'

const exportCmd: Command = {
  type: 'prompt',
  name: 'export',
  description: 'Export workspace data or history',
  argumentHint: '<task>',
  progressMessage: 'analyzing export request',
  contentLength: 0,
  source: 'builtin',
  async getPromptForCommand(args: string): Promise<ContentBlockParam[]> {
    return [
      {
        type: 'text',
        text: `The user wants you to export something: ${args || 'Please ask the user what they want to export.'}\nPlease write the requested data to a file using your tools.`,
      },
    ]
  },
}
export default exportCmd
