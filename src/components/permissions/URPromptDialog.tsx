import React, { type ReactNode, useState, useCallback, useMemo } from 'react'
import { Box, Text } from '../../ink.js'
import type { KeybindingAction } from '../../keybindings/types.js'
import { useKeybindings } from '../../keybindings/useKeybinding.js'
import { Select, SelectMulti, type OptionWithDescription } from '../CustomSelect/index.js'

export type ToolAnalyticsContext = {
  toolName: string
  isMcp: boolean
}

export type URPromptOption<T extends string> = {
  value: T
  label: ReactNode
  description?: string
  feedbackConfig?: {
    type: 'accept' | 'reject'
    placeholder?: string
  }
  keybinding?: KeybindingAction
}

export type URPromptDialogProps<T extends string> = {
  title?: string
  question?: string | ReactNode
  options: URPromptOption<T>[]
  isMultiSelect?: boolean
  onSelect: (value: T | T[], feedback?: string) => void
  onCancel?: () => void
}

const DEFAULT_PLACEHOLDERS = {
  accept: 'tell UR what to do next',
  reject: 'tell UR what to do differently',
}

export function URPromptDialog<T extends string>({
  title,
  question = 'Do you want to proceed?',
  options,
  isMultiSelect = false,
  onSelect,
  onCancel,
}: URPromptDialogProps<T>) {
  const [acceptFeedback, setAcceptFeedback] = useState('')
  const [rejectFeedback, setRejectFeedback] = useState('')
  const [acceptInputMode, setAcceptInputMode] = useState(false)
  const [rejectInputMode, setRejectInputMode] = useState(false)
  const [focusedValue, setFocusedValue] = useState<T | null>(null)

  const focusedOption = options.find(opt => opt.value === focusedValue)
  const focusedFeedbackType = focusedOption?.feedbackConfig?.type

  const showTabHint =
    (focusedFeedbackType === 'accept' && !acceptInputMode) ||
    (focusedFeedbackType === 'reject' && !rejectInputMode)

  const selectOptions: OptionWithDescription<T>[] = options.map(opt => {
    const { value, label, description, feedbackConfig } = opt
    if (!feedbackConfig) {
      return { label, value, description }
    }

    const { type, placeholder } = feedbackConfig
    const isInputMode = type === 'accept' ? acceptInputMode : rejectInputMode
    const onChange = type === 'accept' ? setAcceptFeedback : setRejectFeedback

    if (isInputMode) {
      return {
        type: 'input' as const,
        label,
        value,
        description,
        placeholder: placeholder ?? DEFAULT_PLACEHOLDERS[type],
        onChange,
        allowEmptySubmitToCancel: true,
      }
    }

    return { label, value, description }
  })

  const handleInputModeToggle = (value: T) => {
    const option = options.find(opt => opt.value === value)
    if (!option?.feedbackConfig) return

    if (option.feedbackConfig.type === 'accept') {
      setAcceptInputMode(!acceptInputMode)
    } else if (option.feedbackConfig.type === 'reject') {
      setRejectInputMode(!rejectInputMode)
    }
  }

  const handleSelect = (value: T | T[]) => {
    if (Array.isArray(value)) {
      onSelect(value)
      return
    }
    
    const option = options.find(opt => opt.value === value)
    if (!option) return

    let feedback: string | undefined
    if (option.feedbackConfig) {
      const rawFeedback = option.feedbackConfig.type === 'accept' ? acceptFeedback : rejectFeedback
      const trimmedFeedback = rawFeedback.trim()
      if (trimmedFeedback) {
        feedback = trimmedFeedback
      }
    }
    onSelect(value, feedback)
  }

  const keybindingHandlers: Record<string, () => void> = {}
  options.forEach(opt => {
    if (opt.keybinding) {
      keybindingHandlers[opt.keybinding as unknown as string] = () => handleSelect(opt.value)
    }
  })

  useKeybindings(keybindingHandlers, { context: 'Confirmation' })

  return (
    <Box flexDirection="column" gap={1}>
      {title && <Text bold>{title}</Text>}
      {typeof question === 'string' ? <Text>{question}</Text> : question}
      
      {isMultiSelect ? (
        <SelectMulti
          options={selectOptions}
          onSubmit={handleSelect as any}
          onCancel={onCancel}
        />
      ) : (
        <Select
          options={selectOptions}
          onChange={setFocusedValue as any}
          onSubmit={handleSelect as any}
          onCancel={onCancel}
          onTab={handleInputModeToggle as any}
        />
      )}

      {showTabHint && (
        <Box marginTop={1}>
          <Text dimColor>Press </Text>
          <Text bold>Tab</Text>
          <Text dimColor> to add instructions (optional)</Text>
        </Box>
      )}
    </Box>
  )
}
