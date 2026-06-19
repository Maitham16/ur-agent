// @ts-nocheck
/**
 * Vim Motion Functions
 *
 * Pure functions for resolving vim motions to caret positions.
 */

import type { Caret } from '../utils/caret.js'

/**
 * Resolve a motion to a target caret position.
 * Does not modify anything - pure calculation.
 */
export function resolveMotion(
  key: string,
  caret: Caret,
  count: number,
): Caret {
  let result = caret
  for (let i = 0; i < count; i++) {
    const next = applySingleMotion(key, result)
    if (next.equals(result)) break
    result = next
  }
  return result
}

/**
 * Apply a single motion step.
 */
function applySingleMotion(key: string, caret: Caret): Caret {
  switch (key) {
    case 'h':
      return Caret.left()
    case 'l':
      return Caret.right()
    case 'j':
      return Caret.downLogicalLine()
    case 'k':
      return Caret.upLogicalLine()
    case 'gj':
      return Caret.down()
    case 'gk':
      return Caret.up()
    case 'w':
      return Caret.nextVimWord()
    case 'b':
      return Caret.prevVimWord()
    case 'e':
      return Caret.endOfVimWord()
    case 'W':
      return Caret.nextWORD()
    case 'B':
      return Caret.prevWORD()
    case 'E':
      return Caret.endOfWORD()
    case '0':
      return Caret.startOfLogicalLine()
    case '^':
      return Caret.firstNonBlankInLogicalLine()
    case '$':
      return Caret.endOfLogicalLine()
    case 'G':
      return Caret.startOfLastLine()
    default:
      return caret
  }
}

/**
 * Check if a motion is inclusive (includes character at destination).
 */
export function isInclusiveMotion(key: string): boolean {
  return 'eE$'.includes(key)
}

/**
 * Check if a motion is linewise (operates on full lines when used with operators).
 * Note: gj/gk are characterwise exclusive per `:help gj`, not linewise.
 */
export function isLinewiseMotion(key: string): boolean {
  return 'jkG'.includes(key) || key === 'gg'
}
