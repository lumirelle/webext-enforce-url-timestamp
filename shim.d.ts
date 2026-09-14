import type { ProtocolWithReturn } from 'webext-bridge'

declare module 'webext-bridge' {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    // Content-script shortcut trigger: toggle the master switch, returns the new enabled state
    'toggle-enabled': ProtocolWithReturn<null, boolean>
  }
}
