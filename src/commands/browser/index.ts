import { existsSync } from 'node:fs'
import { join } from 'node:path'
import type { ContentBlockParam } from '@urhq-ai/sdk/resources/index.mjs'
import type { Command } from '../../types/command.js'
import { getCwd } from '../../utils/cwd.js'

const browser: Command = {
  type: 'prompt',
  name: 'browser',
  description: 'Browser pilot (Playwright when installed; otherwise use /chrome)',
  argumentHint: '<url|task>',
  progressMessage: 'launching browser pilot',
  contentLength: 0,
  source: 'builtin',
  async getPromptForCommand(args: string): Promise<ContentBlockParam[]> {
    const task = (args ?? '').trim()
    if (!task) {
      return [{ type: 'text', text: 'usage: /browser <url|task>' }]
    }

    const hasPlaywright =
      existsSync(join(getCwd(), 'node_modules', 'playwright')) ||
      existsSync(join(getCwd(), 'node_modules', 'playwright-core'))

    if (hasPlaywright) {
      return [
        {
          type: 'text',
          text: `Playwright is available. Please drive the browser using playwright to complete this task:\n${task}\n\nNote: Risky actions (form submit, downloads, login) require explicit user approval.`,
        },
      ]
    }

    return [
      {
        type: 'text',
        text: `Playwright is NOT installed.\n\nPlease either ask the user to install it (\`bun add -d playwright && bunx playwright install chromium\`) OR use the built-in /chrome automation to accomplish this task:\n${task}`,
      },
    ]
  },
}

export default browser
