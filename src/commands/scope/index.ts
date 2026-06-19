import type { Command } from '../../types/command.js'
import type { ContentBlockParam } from '@urhq-ai/sdk/resources/index.mjs'

const scopeCmd: Command = {
  type: 'prompt',
  name: 'scope',
  description: 'Scope a project or task with real actions',
  argumentHint: '<task>',
  progressMessage: 'scoping task',
  contentLength: 0,
  source: 'builtin',
  async getPromptForCommand(args: string): Promise<ContentBlockParam[]> {
    return [
      {
        type: 'text',
        text: `The user wants you to scope a task/project: ${args || 'Analyze the current state and provide a scoping document'}\nPlease perform real actions (read files, run commands, list directories) to determine the exact files and dependencies involved in this scope, and then output a clear plan.`,
      },
    ]
  },
}
export default scopeCmd
