import { expect, test } from 'bun:test'
import { ExitPlanModeV2Tool } from '../src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts'

test('ExitPlanMode accepts allowedPrompts as strings', () => {
  const parsed = ExitPlanModeV2Tool.inputSchema.safeParse({
    allowedPrompts: [
      'Generate the HTML file and all required assets for the one-level Mario game',
      'Test the game by opening it in a browser or running a local server',
    ],
  })

  expect(parsed.success).toBe(true)
  if (!parsed.success) return
  expect(parsed.data.allowedPrompts).toEqual([
    {
      tool: 'Bash',
      prompt:
        'Generate the HTML file and all required assets for the one-level Mario game',
    },
    {
      tool: 'Bash',
      prompt:
        'Test the game by opening it in a browser or running a local server',
    },
  ])
})
