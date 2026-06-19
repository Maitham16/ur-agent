import type { Command } from '../../types/command.js'
import type { ContentBlockParam } from '@urhq-ai/sdk/resources/index.mjs'

const playbookCmd: Command = {
  type: 'prompt',
  name: 'playbook',
  description: 'Run a real security or development playbook',
  argumentHint: '<task>',
  progressMessage: 'analyzing playbook',
  contentLength: 0,
  source: 'builtin',
  async getPromptForCommand(args: string): Promise<ContentBlockParam[]> {
    return [
      {
        type: 'text',
        text: `The user wants to run a playbook: ${args || 'Please analyze the workspace and suggest an appropriate security or development playbook to run.'}\nPlease execute real tasks using your available tools (file reads, grep, bash, etc) to complete this playbook.`,
      },
    ]
  },
}
export default playbookCmd
