import type { ProtocolWithReturn } from 'webext-bridge'

declare module 'webext-bridge' {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    // 内容脚本快捷键触发：切换总开关，返回切换后的 enabled 状态
    'toggle-enabled': ProtocolWithReturn<null, boolean>
  }
}
