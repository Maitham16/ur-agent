/**
 * ESC Sequence Parser
 *
 * Handles simple escape sequences: ESC + one or two characters
 */

import type { Action } from './types.js'

/**
 * Parse a simple ESC sequence
 *
 * @param chars - Characters after ESC (not including ESC itself)
 */
export function parseEsc(chars: string): Action | null {
  if (chars.length === 0) return null

  const first = chars[0]!

  // Full reset (RIS)
  if (first === 'c') {
    return { type: 'reset' }
  }

  // caret save (DECSC)
  if (first === '7') {
    return { type: 'caret', action: { type: 'save' } }
  }

  // caret restore (DECRC)
  if (first === '8') {
    return { type: 'caret', action: { type: 'restore' } }
  }

  // Index - move caret down (IND)
  if (first === 'D') {
    return {
      type: 'caret',
      action: { type: 'move', direction: 'down', count: 1 },
    }
  }

  // Reverse index - move caret up (RI)
  if (first === 'M') {
    return {
      type: 'caret',
      action: { type: 'move', direction: 'up', count: 1 },
    }
  }

  // Next line (NEL)
  if (first === 'E') {
    return { type: 'caret', action: { type: 'nextLine', count: 1 } }
  }

  // Horizontal tab set (HTS)
  if (first === 'H') {
    return null // Tab stop, not commonly needed
  }

  // Charset selection (ESC ( X, ESC ) X, etc.) - silently ignore
  if ('()'.includes(first) && chars.length >= 2) {
    return null
  }

  // Unknown
  return { type: 'unknown', sequence: `\x1b${chars}` }
}
