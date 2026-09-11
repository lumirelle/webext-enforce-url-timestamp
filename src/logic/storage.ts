import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export interface TimestampSettings {
  /** 总开关：关闭后不追加时间戳 */
  enabled: boolean
  /** 域名正则列表（对 URL 的 hostname 做匹配） */
  patterns: string[]
  /** 开关切换快捷键，如 "Ctrl+Shift+T"，空字符串表示未设置 */
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
