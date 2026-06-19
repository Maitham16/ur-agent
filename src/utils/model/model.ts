import { getMainLoopModelOverride } from '../../bootstrap/state.js'
import { getSettings_DEPRECATED } from '../settings/settings.js'
import type { PermissionMode } from '../permissions/PermissionMode.js'
import { isModelAllowed } from './modelAllowlist.js'
import { type ModelAlias, isModelAlias } from './aliases.js'
import { capitalize } from '../stringUtils.js'

export type ModelShortName = string
export type ModelName = string
export type ModelSetting = ModelName | ModelAlias | null
const DEFAULT_OLLAMA_MODEL = 'kimi-k2.7-code:cloud'

export function getDefaultOllamaModel(): ModelName {
  return process.env.OLLAMA_MODEL || DEFAULT_OLLAMA_MODEL
}

export function getSmallFastModel(): ModelName {
  return process.env.OLLAMA_SMALL_FAST_MODEL || getDefaultOllamaModel()
}

export function isNonCustommodelOModel(model: ModelName): boolean {
  return false
}

export function getUserSpecifiedModelSetting(): ModelSetting | undefined {
  let specifiedModel: ModelSetting | undefined

  const modelOverride = getMainLoopModelOverride()
  if (modelOverride !== undefined) {
    specifiedModel = modelOverride
  } else {
    const settings = getSettings_DEPRECATED() || {}
    specifiedModel = settings.model || undefined
  }

  if (specifiedModel && !isModelAllowed(specifiedModel)) {
    return undefined
  }

  return specifiedModel
}

export function getMainLoopModel(): ModelName {
  const model = getUserSpecifiedModelSetting()
  if (model !== undefined && model !== null) {
    return parseUserSpecifiedModel(model)
  }
  return getDefaultMainLoopModel()
}

export function getBestModel(): ModelName {
  return getDefaultOllamaModel()
}

export function getDefaultmodelOModel(): ModelName {
  return getDefaultOllamaModel()
}

export function getDefaultmodelSModel(): ModelName {
  return getDefaultOllamaModel()
}

export function getDefaultmodelHModel(): ModelName {
  return getSmallFastModel()
}

export function getRuntimeMainLoopModel(params: {
  permissionMode: PermissionMode
  mainLoopModel: string
  exceeds200kTokens?: boolean
}): ModelName {
  return params.mainLoopModel
}

export function getDefaultMainLoopModelSetting(): ModelName | ModelAlias {
  return getDefaultOllamaModel()
}

export function getDefaultMainLoopModel(): ModelName {
  return parseUserSpecifiedModel(getDefaultMainLoopModelSetting())
}

export function firstPartyNameToCanonical(name: ModelName): ModelShortName {
  return name.toLowerCase()
}

export function getCanonicalName(fullModelName: ModelName): ModelShortName {
  return firstPartyNameToCanonical(fullModelName)
}

export function getURAiUserDefaultModelDescription(fastMode = false): string {
  return 'Ollama Local Model'
}

export function renderDefaultModelSetting(setting: ModelName | ModelAlias): string {
  return renderModelName(parseUserSpecifiedModel(setting))
}

export function getmodelO46PricingSuffix(fastMode: boolean): string {
  return ''
}

export function ismodelO1mMergeEnabled(): boolean {
  return false
}

export function renderModelSetting(setting: ModelName | ModelAlias): string {
  if (isModelAlias(setting)) {
    return capitalize(setting)
  }
  return renderModelName(setting)
}

export function getPublicModelDisplayName(model: ModelName): string | null {
  return null
}

export function renderModelName(model: ModelName): string {
  return model
}

export function getPublicModelName(model: ModelName): string {
  return `Ollama (${model})`
}

export function parseUserSpecifiedModel(
  modelInput: ModelName | ModelAlias,
): ModelName {
  const modelInputTrimmed = modelInput.trim()
  const normalizedModel = modelInputTrimmed.toLowerCase()
  if (isModelAlias(normalizedModel)) {
    return getDefaultOllamaModel()
  }
  return modelInputTrimmed
}

export function resolveSkillModelOverride(
  skillModel: string,
  currentModel: string,
): string {
  return skillModel
}

export function isLegacyModelRemapEnabled(): boolean {
  return false
}

export function modelDisplayString(model: ModelSetting): string {
  if (model === null) {
    return `Default (${getDefaultMainLoopModel()})`
  }
  const resolvedModel = parseUserSpecifiedModel(model)
  return model === resolvedModel ? resolvedModel : `${model} (${resolvedModel})`
}

export function getMarketingNameForModel(modelId: string): string | undefined {
  return undefined
}

export function normalizeModelStringForAPI(model: string): string {
  return model
}
