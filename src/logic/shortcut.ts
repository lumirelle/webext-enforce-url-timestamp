/** Canonical shortcut representation: 'Ctrl+Shift+T' (modifier order fixed as Ctrl,Alt,Shift,Meta, key names uppercase) */

const MODIFIER_KEYS = new Set(['Control', 'Alt', 'Shift', 'Meta'])

function keyName(e: KeyboardEvent): string {
  // Normalize via `code` so keyboard layout / Shift don't interfere: KeyT -> T, Digit1 -> 1
  let m = /^Key([A-Z])$/.exec(e.code)
  if (m?.[1])
    return m[1]
  m = /^Digit(\d)$/.exec(e.code)
  if (m?.[1])
    return m[1]
  m = /^F(\d{1,2})$/.exec(e.code)
  if (m?.[1])
    return `F${m[1]}`
  if (e.code === 'Space')
    return 'Space'
  const special: Record<string, string> = {
    Enter: 'Enter',
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
    Comma: ',',
    Period: '.',
    Semicolon: ';',
    Quote: '\'',
    Minus: '-',
    Equal: '=',
    Slash: '/',
    Backslash: '\\',
    Backquote: '`',
    BracketLeft: '[',
    BracketRight: ']',
  }
  if (special[e.code] !== undefined)
    return special[e.code]!
  // Fallback: use e.key for printable characters
  return e.key.length === 1 ? e.key.toUpperCase() : e.key
}

/** Parse a combo string from a keyboard event; returns null for modifier-only presses */
export function comboFromKeyboardEvent(e: KeyboardEvent): string | null {
  if (MODIFIER_KEYS.has(e.key))
    return null
  const parts: string[] = []
  if (e.ctrlKey)
    parts.push('Ctrl')
  if (e.altKey)
    parts.push('Alt')
  if (e.shiftKey)
    parts.push('Shift')
  if (e.metaKey)
    parts.push('Meta')
  parts.push(keyName(e))
  return parts.join('+')
}

/** Compare two combo strings case-insensitively */
export function comboEquals(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase() && a.trim() !== ''
}
