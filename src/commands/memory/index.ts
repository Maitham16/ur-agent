import type { Command } from '../../types/command.js'
import type { ContentBlockParam } from '@urhq-ai/sdk/resources/index.mjs'

const memoryCmd: Command = {
  type: 'prompt',
  name: 'memory',
  description: 'Manage or view agent memory',
  argumentHint: '<task>',
  progressMessage: 'analyzing memory request',
  contentLength: 0,
  source: 'builtin',
  async getPromptForCommand(args: string): Promise<ContentBlockParam[]> {
    return [
      {
        type: 'text',
        text: `The user wants you to manage memory: ${args || 'Please summarize the project state and write it to .ur/memory.md'}\nPlease execute file reads/writes to maintain context across sessions.`,
      },
    ]
  },
}
export default memoryCmd
