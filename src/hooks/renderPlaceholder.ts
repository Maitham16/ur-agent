import chalk from 'chalk'

type PlaceholderRendererProps = {
  placeholder?: string
  value: string
  showCaret?: boolean
  focus?: boolean
  terminalFocus: boolean
  invert?: (text: string) => string
  hidePlaceholderText?: boolean
}

export function renderPlaceholder({
  placeholder,
  value,
  showCaret,
  focus,
  terminalFocus = true,
  invert = chalk.inverse,
  hidePlaceholderText = false,
}: PlaceholderRendererProps): {
  renderedPlaceholder: string | undefined
  showPlaceholder: boolean
} {
  let renderedPlaceholder: string | undefined = undefined

  if (placeholder) {
    if (hidePlaceholderText) {
      // Voice recording: show only the caret, no placeholder text
      renderedPlaceholder =
        showCaret && focus && terminalFocus ? invert(' ') : ''
    } else {
      renderedPlaceholder = chalk.dim(placeholder)

      // Show inverse caret only when both input and terminal are focused
      if (showCaret && focus && terminalFocus) {
        renderedPlaceholder =
          placeholder.length > 0
            ? invert(placeholder[0]!) + chalk.dim(placeholder.slice(1))
            : invert(' ')
      }
    }
  }

  const showPlaceholder = value.length === 0 && Boolean(placeholder)

  return {
    renderedPlaceholder,
    showPlaceholder,
  }
}
