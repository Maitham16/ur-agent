import type { Command } from '../../types/command.js'
import type { ContentBlockParam } from '@urhq-ai/sdk/resources/index.mjs'

const addDirCmd: Command = {
  type: 'prompt',
  name: 'add-dir',
  description: 'Add a new directory to the workspace',
  argumentHint: '<path>',
  progressMessage: 'creating directory',
  contentLength: 0,
  source: 'builtin',
  async getPromptForCommand(args: string): Promise<ContentBlockParam[]> {
    return [
      {
        type: 'text',
        text: `The user wants you to create a new directory or add a workspace directory: ${args || 'Please ask the user what directory they want to create.'}\nPlease execute the bash command 'mkdir -p' or equivalent to create the requested folder. Ensure it succeeds and tell the user.`,
      },
    ]
  },
}
export default addDirCmd
