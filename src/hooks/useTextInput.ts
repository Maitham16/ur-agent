// @ts-nocheck
import { isInputModeCharacter } from 'src/components/PromptInput/inputModes.js'
import { useNotifications } from 'src/context/notifications.js'
import { useRef } from 'react'
import stripAnsi from 'strip-ansi'
import { markBackslashReturnUsed } from '../commands/terminalSetup/terminalSetup.js'
import { addToHistory } from '../history.js'
import type { Key } from '../ink.js'
import type {
  InlineGhostText,
  TextInputState,
} from '../types/textInputTypes.js'
import {
  Caret as caret,
  getLastKill,
  pushToKillRing,
  recordYank,
  resetKillAccumulation,
  resetYankState,
  updateYankLength,
  yankPop,
} from '../utils/caret.js'
import { isFullscreenEnvEnabled } from '../utils/fullscreen.js'
import type { ImageDimensions } from '../utils/imageResizer.js'
import { useDoublePress } from './useDoublePress.js'

type Maybecaret = void | caret
type InputHandler = (input: string) => Maybecaret
type InputMapper = (input: string) => Maybecaret
const NOOP_HANDLER: InputHandler = () => {}
function mapInput(input_map: Array<[string, InputHandler]>): InputMapper {
  const map = new Map(input_map)
  return function (input: string): Maybecaret {
    return (map.get(input) ?? NOOP_HANDLER)(input)
  }
}

export type UseTextInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  onExit?: () => void
  onExitMessage?: (show: boolean, key?: string) => void
  onHistoryUp?: () => void
  onHistoryDown?: () => void
  onHistoryReset?: () => void
  onClearInput?: () => void
  focus?: boolean
  mask?: string
  multiline?: boolean
  caretChar: string
  highlightPastedText?: boolean
  invert: (text: string) => string
  themeText: (text: string) => string
  columns: number
  onImagePaste?: (
    base64Image: string,
    mediaType?: string,
    filename?: string,
    dimensions?: ImageDimensions,
    sourcePath?: string,
  ) => void
  disableCaretMovementForUpDownKeys?: boolean
  disableEscapeDoublePress?: boolean
  maxVisibleLines?: number
  externalOffset: number
  onOffsetChange: (offset: number) => void
  inputFilter?: (input: string, key: Key) => string
  inlineGhostText?: InlineGhostText
  dim?: (text: string) => string
}

export function useTextInput({
  value: originalValue,
  onChange,
  onSubmit,
  onExit,
  onExitMessage,
  onHistoryUp,
  onHistoryDown,
  onHistoryReset,
  onClearInput,
  mask = '',
  multiline = false,
  caretChar,
  invert,
  columns,
  onImagePaste: _onImagePaste,
  disableCaretMovementForUpDownKeys = false,
  disableEscapeDoublePress = false,
  maxVisibleLines,
  externalOffset,
  onOffsetChange,
  inputFilter,
  inlineGhostText,
  dim,
}: UseTextInputProps): TextInputState {
  const offset = externalOffset
  const setOffset = onOffsetChange
  const caretInst = caret.fromText(originalValue, columns, offset)
  const latestcaretRef = useRef(caretInst)
  latestcaretRef.current = caretInst
  const { addNotification, removeNotification } = useNotifications()

  const handleCtrlC = useDoublePress(
    show => {
      onExitMessage?.(show, 'Ctrl-C')
    },
    () => onExit?.(),
    () => {
      if (originalValue) {
        onChange('')
        setOffset(0)
        onHistoryReset?.()
      }
    },
  )

  // NOTE(keybindings): This escape handler is intentionally NOT migrated to the keybindings system.
  // It's a text-level double-press escape for clearing input, not an action-level keybinding.
  // Double-press Esc clears the input and saves to history - this is text editing behavior,
  // not dialog dismissal, and needs the double-press safety mechanism.
  const handleEscape = useDoublePress(
    (show: boolean) => {
      if (!originalValue || !show) {
        return
      }
      addNotification({
        key: 'escape-again-to-clear',
        text: 'Esc again to clear',
        priority: 'immediate',
        timeoutMs: 1000,
      })
    },
    () => {
      // Remove the "Esc again to clear" notification immediately
      removeNotification('escape-again-to-clear')
      onClearInput?.()
      if (originalValue) {
        // Track double-escape usage for feature discovery
        // Save to history before clearing
        if (originalValue.trim() !== '') {
          addToHistory(originalValue)
        }
        onChange('')
        setOffset(0)
        onHistoryReset?.()
      }
    },
  )

  const handleEmptyCtrlD = useDoublePress(
    show => {
      if (originalValue !== '') {
        return
      }
      onExitMessage?.(show, 'Ctrl-D')
    },
    () => {
      if (originalValue !== '') {
        return
      }
      onExit?.()
    },
  )

  function handleCtrlD(): Maybecaret {
    if (caretInst.text === '') {
      // When input is empty, handle double-press
      handleEmptyCtrlD()
      return caretInst
    }
    // When input is not empty, delete forward like iPython
    return caretInst.del()
  }

  function killToLineEnd(): caret {
    const { caret: newcaret, killed } = caretInst.deleteToLineEnd()
    pushToKillRing(killed, 'append')
    return newcaret
  }

  function killToLineStart(): caret {
    const { caret: newcaret, killed } = caretInst.deleteToLineStart()
    pushToKillRing(killed, 'prepend')
    return newcaret
  }

  function killWordBefore(): caret {
    const { caret: newcaret, killed } = caretInst.deleteWordBefore()
    pushToKillRing(killed, 'prepend')
    return newcaret
  }

  function yank(): caret {
    const text = getLastKill()
    if (text.length > 0) {
      const startOffset = caretInst.offset
      const newcaret = caretInst.insert(text)
      recordYank(startOffset, text.length)
      return newcaret
    }
    return caretInst
  }

  function handleYankPop(): caret {
    const popResult = yankPop()
    if (!popResult) {
      return caretInst
    }
    const { text, start, length } = popResult
    // Replace the previously yanked text with the new one
    const before = caretInst.text.slice(0, start)
    const after = caretInst.text.slice(start + length)
    const newText = before + text + after
    const newOffset = start + text.length
    updateYankLength(text.length)
    return caret.fromText(newText, columns, newOffset)
  }

  const handleCtrl = mapInput([
    ['a', () => caretInst.startOfLine()],
    ['b', () => caretInst.left()],
    ['c', handleCtrlC],
    ['d', handleCtrlD],
    ['e', () => caretInst.endOfLine()],
    ['f', () => caretInst.right()],
    ['h', () => caretInst.deleteTokenBefore() ?? caretInst.backspace()],
    ['k', killToLineEnd],
    ['n', () => downOrHistoryDown()],
    ['p', () => upOrHistoryUp()],
    ['u', killToLineStart],
    ['w', killWordBefore],
    ['y', yank],
  ])

  const handleMeta = mapInput([
    ['b', () => caretInst.prevWord()],
    ['f', () => caretInst.nextWord()],
    ['d', () => caretInst.deleteWordAfter()],
    ['y', handleYankPop],
  ])

  function handleEnter(key: Key) {
    const latestcaret = latestcaretRef.current
    if (
      multiline &&
      latestcaret.offset > 0 &&
      latestcaret.text[latestcaret.offset - 1] === '\\'
    ) {
      // Track that the user has used backslash+return
      markBackslashReturnUsed()
      return latestcaret.backspace().insert('\n')
    }
    // Meta+Enter or Shift+Enter inserts a newline
    if (key.meta || key.shift) {
      return latestcaret.insert('\n')
    }
    onSubmit?.(latestcaret.text)
  }

  function upOrHistoryUp() {
    if (disableCaretMovementForUpDownKeys) {
      onHistoryUp?.()
      return caretInst
    }
    // Try to move by wrapped lines first
    const caretUp = caretInst.up()
    if (!caretUp.equals(caretInst)) {
      return caretUp
    }

    // If we can't move by wrapped lines and this is multiline input,
    // try to move by logical lines (to handle paragraph boundaries)
    if (multiline) {
      const caretUpLogical = caretInst.upLogicalLine()
      if (!caretUpLogical.equals(caretInst)) {
        return caretUpLogical
      }
    }

    // Can't move up at all - trigger history navigation
    onHistoryUp?.()
    return caretInst
  }
  function downOrHistoryDown() {
    if (disableCaretMovementForUpDownKeys) {
      onHistoryDown?.()
      return caretInst
    }
    // Try to move by wrapped lines first
    const caretDown = caretInst.down()
    if (!caretDown.equals(caretInst)) {
      return caretDown
    }

    // If we can't move by wrapped lines and this is multiline input,
    // try to move by logical lines (to handle paragraph boundaries)
    if (multiline) {
      const caretDownLogical = caretInst.downLogicalLine()
      if (!caretDownLogical.equals(caretInst)) {
        return caretDownLogical
      }
    }

    // Can't move down at all - trigger history navigation
    onHistoryDown?.()
    return caretInst
  }

  function mapKey(key: Key): InputMapper {
    switch (true) {
      case key.escape:
        return () => {
          // Skip when a keybinding context (e.g. Autocomplete) owns escape.
          // useKeybindings can't shield us via stopImmediatePropagation —
          // BaseTextInput's useInput registers first (child effects fire
          // before parent effects), so this handler has already run by the
          // time the keybinding's handler stops propagation.
          if (disableEscapeDoublePress) return caretInst
          handleEscape()
          // Return the current caret unchanged - handleEscape manages state internally
          return caretInst
        }
      case key.leftArrow && (key.ctrl || key.meta || key.fn):
        return () => caretInst.prevWord()
      case key.rightArrow && (key.ctrl || key.meta || key.fn):
        return () => caretInst.nextWord()
      case key.backspace:
        return key.meta || key.ctrl
          ? killWordBefore
          : () => caretInst.deleteTokenBefore() ?? caretInst.backspace()
      case key.delete:
        return key.meta ? killToLineEnd : () => caretInst.del()
      case key.ctrl:
        return handleCtrl
      case key.home:
        return () => caretInst.startOfLine()
      case key.end:
        return () => caretInst.endOfLine()
      case key.pageDown:
        // In fullscreen mode, PgUp/PgDn scroll the message viewport instead
        // of moving the caret — no-op here, ScrollKeybindingHandler handles it.
        if (isFullscreenEnvEnabled()) {
          return NOOP_HANDLER
        }
        return () => caretInst.endOfLine()
      case key.pageUp:
        if (isFullscreenEnvEnabled()) {
          return NOOP_HANDLER
        }
        return () => caretInst.startOfLine()
      case key.wheelUp:
      case key.wheelDown:
        // Mouse wheel events only exist when fullscreen mouse tracking is on.
        // ScrollKeybindingHandler handles them; no-op here to avoid inserting
        // the raw SGR sequence as text.
        return NOOP_HANDLER
      case key.return:
        // Must come before key.meta so Option+Return inserts newline
        return () => handleEnter(key)
      case key.meta:
        return handleMeta
      case key.tab:
        return () => caretInst
      case key.upArrow && !key.shift:
        return upOrHistoryUp
      case key.downArrow && !key.shift:
        return downOrHistoryDown
      case key.leftArrow:
        return () => caretInst.left()
      case key.rightArrow:
        return () => caretInst.right()
      default: {
        return function (input: string) {
          switch (true) {
            // Home key
            case input === '\x1b[H' || input === '\x1b[1~':
              return caretInst.startOfLine()
            // End key
            case input === '\x1b[F' || input === '\x1b[4~':
              return caretInst.endOfLine()
            default: {
              // Trailing \r after text is SSH-coalesced Enter ("o\r") —
              // strip it so the Enter isn't inserted as content. Lone \r
              // here is Alt+Enter leaking through (META_KEY_CODE_RE doesn't
              // match \x1b\r) — leave it for the \r→\n below. Embedded \r
              // is multi-line paste from a terminal without bracketed
              // paste — convert to \n. Backslash+\r is a stale VS Code
              // Shift+Enter binding (pre-#8991 /terminal-setup wrote
              // args.text "\\\r\n" to keybindings.json); keep the \r so
              // it becomes \n below (urhqs/ur#31316).
              const text = stripAnsi(input)
                // eslint-disable-next-line custom-rules/no-lookbehind-regex -- .replace(re, str) on 1-2 char keystrokes: no-match returns same string (Object.is), regex never runs
                .replace(/(?<=[^\\\r\n])\r$/, '')
                .replace(/\r/g, '\n')
              if (caretInst.isAtStart() && isInputModeCharacter(input)) {
                return caretInst.insert(text).left()
              }
              return caretInst.insert(text)
            }
          }
        }
      }
    }
  }

  // Check if this is a kill command (Ctrl+K, Ctrl+U, Ctrl+W, or Meta+Backspace/Delete)
  function isKillKey(key: Key, input: string): boolean {
    if (key.ctrl && (input === 'k' || input === 'u' || input === 'w')) {
      return true
    }
    if (key.meta && (key.backspace || key.delete)) {
      return true
    }
    return false
  }

  // Check if this is a yank command (Ctrl+Y or Alt+Y)
  function isYankKey(key: Key, input: string): boolean {
    return (key.ctrl || key.meta) && input === 'y'
  }

  function onInput(input: string, key: Key): void {
    // Note: Image paste shortcut (chat:imagePaste) is handled via useKeybindings in PromptInput

    // Apply filter if provided
    const filteredInput = inputFilter ? inputFilter(input, key) : input

    // If the input was filtered out, do nothing
    if (filteredInput === '' && input !== '') {
      return
    }

    // Fix Issue #1853: Filter DEL characters that interfere with backspace in SSH/tmux
    // In SSH/tmux environments, backspace generates both key events and raw DEL chars
    if (!key.backspace && !key.delete && input.includes('\x7f')) {
      const delCount = (input.match(/\x7f/g) || []).length

      // Apply all DEL characters as backspace operations synchronously
      // Try to delete tokens first, fall back to character backspace
      let currentcaret = caretInst
      for (let i = 0; i < delCount; i++) {
        currentcaret =
          currentcaret.deleteTokenBefore() ?? currentcaret.backspace()
      }

      // Update state once with the final result
      latestcaretRef.current = currentcaret
      if (!caretInst.equals(currentcaret)) {
        if (caretInst.text !== currentcaret.text) {
          onChange(currentcaret.text)
        }
        setOffset(currentcaret.offset)
      }
      resetKillAccumulation()
      resetYankState()
      return
    }

    // Reset kill accumulation for non-kill keys
    if (!isKillKey(key, filteredInput)) {
      resetKillAccumulation()
    }

    // Reset yank state for non-yank keys (breaks yank-pop chain)
    if (!isYankKey(key, filteredInput)) {
      resetYankState()
    }

    const nextcaret = mapKey(key)(filteredInput)
    if (nextcaret) {
      latestcaretRef.current = nextcaret
      if (!caretInst.equals(nextcaret)) {
        if (caretInst.text !== nextcaret.text) {
          onChange(nextcaret.text)
        }
        setOffset(nextcaret.offset)
      }
      // SSH-coalesced Enter: on slow links, "o" + Enter can arrive as one
      // chunk "o\r". parseKeypress only matches s === '\r', so it hit the
      // default handler above (which stripped the trailing \r). Text with
      // exactly one trailing \r is coalesced Enter; lone \r is Alt+Enter
      // (newline); embedded \r is multi-line paste.
      if (
        filteredInput.length > 1 &&
        filteredInput.endsWith('\r') &&
        !filteredInput.slice(0, -1).includes('\r') &&
        // Backslash+CR is a stale VS Code Shift+Enter binding, not
        // coalesced Enter. See default handler above.
        filteredInput[filteredInput.length - 2] !== '\\'
      ) {
        onSubmit?.(nextcaret.text)
      }
    }
  }

  // Prepare ghost text for rendering - validate insertPosition matches current
  // caret offset to prevent stale ghost text from a previous keystroke causing
  // a one-frame jitter (ghost text state is updated via useEffect after render)
  const ghostTextForRender =
    inlineGhostText && dim && inlineGhostText.insertPosition === offset
      ? { text: inlineGhostText.text, dim }
      : undefined

  const caretPos = caretInst.getPosition()

  return {
    onInput,
    renderedValue: caretInst.render(
      caretChar,
      mask,
      invert,
      ghostTextForRender,
      maxVisibleLines,
    ),
    offset,
    setOffset,
    caretLine: caretPos.line - caretInst.getViewportStartLine(maxVisibleLines),
    caretColumn: caretPos.column,
    viewportCharOffset: caretInst.getViewportCharOffset(maxVisibleLines),
    viewportCharEnd: caretInst.getViewportCharEnd(maxVisibleLines),
  }
}
