import type { Command } from '../../types/command.js'
import type { ContentBlockParam } from '@urhq-ai/sdk/resources/index.mjs'

const statusCmd: Command = {
  type: 'prompt',
  name: 'status',
  description: 'Show project and system status',
  argumentHint: '<optional_target>',
  progressMessage: 'gathering status',
  contentLength: 0,
  source: 'builtin',
  async getPromptForCommand(args: string): Promise<ContentBlockParam[]> {
    return [
      {
        type: 'text',
        text: `The user wants you to show the current status: ${args || 'Please analyze the system, git repository, and environment and provide a status update.'}\nPlease gather real data using tools like git status, system checks, etc., and present it cleanly.`,
      },
    ]
  },
}
export default statusCmd
