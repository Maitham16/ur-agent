import type { Command } from '../../types/command.js'
import type { ContentBlockParam } from '@urhq-ai/sdk/resources/index.mjs'

const stabilityCmd: Command = {
  type: 'prompt',
  name: 'stability',
  description: 'Analyze the stability of the project and perform real fixes',
  argumentHint: '<task>',
  progressMessage: 'analyzing stability',
  contentLength: 0,
  source: 'builtin',
  async getPromptForCommand(args: string): Promise<ContentBlockParam[]> {
    return [
      {
        type: 'text',
        text: `The user wants you to check the stability of the project: ${args || 'Please run a build or tests to verify stability'}\nPlease run real commands (like 'npm run build', 'tsc', 'npm test' or equivalent) to check for stability issues. If the code is correct, provide a hint to the user on how to use it. If there are issues, fix them using your tools.`,
      },
    ]
  },
}
export default stabilityCmd
