import type { Command } from '../../types/command.js'
import type { ContentBlockParam } from '@urhq-ai/sdk/resources/index.mjs'

const terminalSetupCmd: Command = {
  type: 'prompt',
  name: 'terminal-setup',
  description: 'Setup the terminal with proper configurations',
  argumentHint: '<task>',
  progressMessage: 'analyzing terminal setup',
  contentLength: 0,
  source: 'builtin',
  async getPromptForCommand(args: string): Promise<ContentBlockParam[]> {
    return [
      {
        type: 'text',
        text: `The user wants you to help setup their terminal: ${args || 'Please provide configuration for terminal tools or check my environment.'}\nPlease gather real data using tools to check their OS, shell, and provide concrete instructions or scripts to set up their terminal.`,
      },
    ]
  },
}
export default terminalSetupCmd
