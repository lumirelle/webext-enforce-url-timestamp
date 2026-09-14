import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export interface TimestampSettings {
  /** Master switch: when off, no timestamp is appended */
  enabled: boolean
  /** Domain regex list (matched against the URL's hostname) */
  patterns: string[]
  /** Toggle shortcut, e.g. "Ctrl+Shift+T"; an empty string means unset */
  shortcut: string
}

export const DEFAULT_SETTINGS: TimestampSettings = {
  enabled: true,
  patterns: [],
  shortcut: '',
}

export const { data: settings, dataReady: settingsReady } = useWebExtensionStorage(
  'url-timestamp-settings',
  DEFAULT_SETTINGS,
)

export { appendTimestamp, isValidRegex } from './timestamp'
