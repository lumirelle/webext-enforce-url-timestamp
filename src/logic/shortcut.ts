/** 快捷键统一表示：'Ctrl+Shift+T'（修饰键顺序固定 Ctrl,Alt,Shift,Meta，键名大写） */

const MODIFIER_KEYS = new Set(['Control', 'Alt', 'Shift', 'Meta'])

function keyName(e: KeyboardEvent): string {
  // 用 code 归一化，避免不同键盘布局/Shift 影响：KeyT -> T, Digit1 -> 1
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
  // 兜底：可打印字符取 e.key
  return e.key.length === 1 ? e.key.toUpperCase() : e.key
}

/** 从键盘事件解析组合键字符串；纯修饰键按下返回 null */
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

/** 大小写不敏感地比较两个组合键字符串 */
export function comboEquals(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase() && a.trim() !== ''
}
