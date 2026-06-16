#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const entrypoint = resolve(packageRoot, 'src/entrypoints/cli.tsx')
const preload = resolve(packageRoot, 'plugins/bunBundleDev.ts')

const bun = process.env.BUN_BIN || process.env.BUN_EXECUTABLE || 'bun'
const ollamaModel =
  process.env.OLLAMA_MODEL || process.env.UR_MODEL || 'kimi-k2.7-code:cloud'
const args = [
  'run',
  '--preload',
  preload,
  '--define',
  'MACRO.VERSION="1.0.0-dev"',
  '--define',
  'MACRO.BUILD_TIME=""',
  '--define',
  'MACRO.PACKAGE_URL="ur"',
  '--define',
  'MACRO.NATIVE_PACKAGE_URL=undefined',
  '--define',
  'MACRO.FEEDBACK_CHANNEL=""',
  '--define',
  'MACRO.ISSUES_EXPLAINER=""',
  '--define',
  'MACRO.VERSION_CHANGELOG=""',
  entrypoint,
  ...process.argv.slice(2),
]

const child = spawn(bun, args, {
  cwd: process.cwd(),
  env: {
    ...process.env,
    OLLAMA_MODEL: ollamaModel,
  },
  stdio: 'inherit',
})

child.on('error', error => {
  if (error.code === 'ENOENT') {
    console.error(
      'Ur requires Bun to run. Install Bun from https://bun.sh, then retry.',
    )
    process.exit(1)
  }

  console.error(error.message)
  process.exit(1)
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})
