import { sendMessage } from 'webext-bridge/content-script'
import { comboEquals, comboFromKeyboardEvent } from '~/logic/shortcut'
import { settings } from '~/logic/storage'

// Lightweight toast: shows the switch state after toggling, disappears after 1.8s
function showToast(text: string) {
  const el = document.createElement('div')
  el.textContent = text
  el.setAttribute(
    'style',
    [
      'position:fixed',
      'top:16px',
      'left:50%',
      'transform:translateX(-50%)',
      'z-index:2147483647',
      'padding:8px 16px',
      'border-radius:6px',
      'background:rgba(20,20,20,0.85)',
      'color:#fff',
      'font:13px/1.4 sans-serif',
      'box-shadow:0 2px 8px rgba(0,0,0,0.3)',
      'pointer-events:none',
      'transition:opacity .3s',
    ].join(';'),
  )
  document.documentElement.appendChild(el)
  setTimeout(() => {
    el.style.opacity = '0'
    setTimeout(() => el.remove(), 350)
  }, 1800)
}

function isEditable(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement))
    return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
}

window.addEventListener(
  'keydown',
  (e) => {
    const combo = comboFromKeyboardEvent(e)
    if (!combo)
      return
    const configured = settings.value.shortcut
    if (!configured || !comboEquals(combo, configured))
      return
    // Don't check `enabled`: the shortcut must keep working even when the switch is off
    if (isEditable(e.target))
      return
    e.preventDefault()
    e.stopPropagation()
    void (async () => {
      try {
        const enabled = await sendMessage('toggle-enabled', null)
        showToast(enabled ? 'TimeSeal · Timestamp enabled' : 'TimeSeal · Timestamp disabled')
      }
      catch (err) {
        // oxlint-disable-next-line no-console
        console.error('[time-seal] toggle failed', err)
      }
    })()
  },
  true,
)
