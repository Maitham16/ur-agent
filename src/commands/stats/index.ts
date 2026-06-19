import type { Command } from '../../types/command.js'
import type { ContentBlockParam } from '@urhq-ai/sdk/resources/index.mjs'

const statsCmd: Command = {
  type: 'prompt',
  name: 'stats',
  description: 'Show project and agent usage statistics',
  argumentHint: '<optional_target>',
  progressMessage: 'gathering stats',
  contentLength: 0,
  source: 'builtin',
  async getPromptForCommand(args: string): Promise<ContentBlockParam[]> {
    return [
      {
        type: 'text',
        text: `The user wants you to show statistics: ${args || 'Please analyze the project directory and provide statistics such as lines of code, number of files, or any other relevant metrics.'}\nPlease gather real data using tools and present it cleanly.`,
      },
    ]
  },
}
export default statsCmd
