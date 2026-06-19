import type { Command } from '../../types/command.js'
import type { ContentBlockParam } from '@urhq-ai/sdk/resources/index.mjs'

const vimCmd: Command = {
  type: 'prompt',
  name: 'vim',
  description: 'Learn or use vim commands',
  argumentHint: '<task>',
  progressMessage: 'analyzing vim request',
  contentLength: 0,
  source: 'builtin',
  async getPromptForCommand(args: string): Promise<ContentBlockParam[]> {
    return [
      {
        type: 'text',
        text: `The user wants you to help with vim: ${args || 'Please explain basic vim motions or help configure my .vimrc.'}\nPlease execute real actions or explain clearly. Note: the internal vim emulator is disabled for stability, so help them with system vim instead.`,
      },
    ]
  },
}
export default vimCmd
