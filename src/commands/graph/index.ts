import type { Command } from '../../types/command.js'
import type { ContentBlockParam } from '@urhq-ai/sdk/resources/index.mjs'

const graphCmd: Command = {
  type: 'prompt',
  name: 'graph',
  description: 'Graph dependencies or file relationships',
  argumentHint: '<task>',
  progressMessage: 'analyzing graph request',
  contentLength: 0,
  source: 'builtin',
  async getPromptForCommand(args: string): Promise<ContentBlockParam[]> {
    return [
      {
        type: 'text',
        text: `The user wants you to create or modify a graph: ${args || 'Please analyze the workspace and produce a graph of the dependencies or files.'}\nPlease write the graph output or provide mermaid markdown representing the graph.`,
      },
    ]
  },
}
export default graphCmd
