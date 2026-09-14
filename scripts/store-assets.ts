/**
 * 生成商店素材：真实界面截图（Playwright 加载已构建扩展）+ 1280x800 宣传图 + 推广图块。
 * 运行：mise run build && nub scripts/store-assets.ts
 */
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { chromium } from '@playwright/test'
import fs from 'fs-extra'

const rootDir = path.resolve(import.meta.dirname, '..')
const extensionPath = path.join(rootDir, 'extension')
const outDir = path.join(rootDir, 'store')
const rawDir = path.join(outDir, '.raw')

const FONT = `'Noto Sans CJK SC', 'Source Han Sans SC', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`
const MONO = `'JetBrains Mono', 'DejaVu Sans Mono', monospace`

const C = {
  navy: '#1A2332',
  navyDeep: '#131B28',
  teal: '#2D8B8B',
  tealBright: '#3AA6A6',
  seafoam: '#A8DADC',
  cream: '#F1FAEE',
  ink: '#1A2332',
  muted: '#5B6B7A',
}

async function dataUri(file: string) {
  const buf = await fs.readFile(file)
  const ext = path.extname(file).slice(1)
  return `data:image/${ext === 'svg' ? 'svg+xml' : ext};base64,${buf.toString('base64')}`
}

async function captureUi() {
  const context = await chromium.launchPersistentContext('', {
    channel: 'chromium',
    headless: true,
    viewport: { width: 760, height: 1000 },
    deviceScaleFactor: 2,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  })

  await sleep(800)
  let [bg] = context.serviceWorkers()
  if (!bg)
    bg = await context.waitForEvent('serviceworker')
  const id = new URL(bg.url()).host

  await fs.ensureDir(rawDir)

  const options = await context.newPage()
  await options.setViewportSize({ width: 760, height: 1000 })
  await options.goto(`chrome-extension://${id}/dist/options/index.html`)
  await options.waitForTimeout(400)
  await options.screenshot({ path: path.join(rawDir, 'options.png'), fullPage: true })

  const popup = await context.newPage()
  await popup.setViewportSize({ width: 340, height: 430 })
  await popup.goto(`chrome-extension://${id}/dist/popup/index.html`)
  await popup.waitForTimeout(400)
  await popup.screenshot({ path: path.join(rawDir, 'popup.png') })

  await context.close()

  return {
    options: await dataUri(path.join(rawDir, 'options.png')),
    popup: await dataUri(path.join(rawDir, 'popup.png')),
  }
}

function shell(body: string, w: number, h: number) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: ${w}px; height: ${h}px; overflow: hidden; font-family: ${FONT}; }
    body { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
    code, .mono { font-family: ${MONO}; }
  </style></head><body>${body}</body></html>`
}

interface Ui { options: string, popup: string }

function hero(ui: Ui, icon: string) {
  return shell(`
  <div style="position:relative;width:1280px;height:800px;background:
      radial-gradient(900px 620px at 88% -10%, rgba(58,166,166,.38), transparent 60%),
      radial-gradient(700px 520px at 8% 110%, rgba(45,139,139,.30), transparent 62%),
      linear-gradient(135deg, ${C.navy} 0%, ${C.navyDeep} 100%);
      display:flex;align-items:center;gap:64px;padding:0 84px;color:${C.cream};overflow:hidden;">
    <div style="position:absolute;inset:0;opacity:.10;
      background-image:radial-gradient(${C.seafoam} 1.6px, transparent 1.6px);
      background-size:34px 34px;"></div>

    <div style="position:relative;z-index:2;flex:0 0 500px;">
      <img src="${icon}" width="104" height="104" style="border-radius:26px;box-shadow:0 20px 44px rgba(0,0,0,.5);display:block;">
      <div style="margin-top:30px;font-size:60px;font-weight:800;letter-spacing:-1px;line-height:1.05;">
        时印 <span style="color:${C.seafoam};">TimeSeal</span>
      </div>
      <div style="margin-top:16px;font-size:26px;font-weight:500;color:${C.seafoam};">
        给 URL 盖上此刻的时间戳
      </div>
      <div style="margin-top:14px;font-size:19px;line-height:1.6;color:rgba(241,250,238,.72);">
        命中域名的页面在导航前被强制改写为<br>
        <span class="mono" style="color:#fff;background:rgba(168,218,220,.14);padding:3px 10px;border-radius:7px;">?t=&lt;当前毫秒时间戳&gt;</span>
        ，绕过浏览器与 CDN 缓存，永远加载最新内容。
      </div>
      <div style="margin-top:30px;display:flex;gap:14px;font-size:15px;color:rgba(241,250,238,.85);">
        <span style="padding:8px 16px;border:1px solid rgba(168,218,220,.35);border-radius:999px;">正则匹配域名</span>
        <span style="padding:8px 16px;border:1px solid rgba(168,218,220,.35);border-radius:999px;">快捷键总开关</span>
      </div>
    </div>

    <div style="position:relative;z-index:2;flex:1;display:flex;justify-content:flex-end;">
      <div style="width:470px;max-height:660px;border-radius:18px;overflow:hidden;
        box-shadow:0 40px 90px rgba(0,0,0,.55), 0 0 0 1px rgba(168,218,220,.22);background:#fff;">
        <div style="height:34px;background:#EAF1F2;display:flex;align-items:center;gap:7px;padding:0 14px;">
          <span style="width:11px;height:11px;border-radius:50%;background:#FF5F57;"></span>
          <span style="width:11px;height:11px;border-radius:50%;background:#FEBC2E;"></span>
          <span style="width:11px;height:11px;border-radius:50%;background:#28C840;"></span>
          <span style="margin-left:12px;font-size:12px;color:#7C8A93;">时印 TimeSeal · 设置</span>
        </div>
        <img src="${ui.options}" style="display:block;width:470px;">
      </div>
    </div>
  </div>`, 1280, 800)
}

function domains(ui: Ui) {
  return shell(`
  <div style="width:1280px;height:800px;background:linear-gradient(160deg,#F7FBFB 0%,#E7F2F2 100%);
      padding:64px 84px;display:flex;gap:60px;align-items:center;color:${C.ink};overflow:hidden;">
    <div style="flex:0 0 430px;">
      <div style="font-size:15px;font-weight:700;letter-spacing:2px;color:${C.teal};">DOMAIN RULES</div>
      <div style="margin-top:14px;font-size:46px;font-weight:800;line-height:1.15;letter-spacing:-.5px;">
        为指定域名<br>强制刷新
      </div>
      <div style="margin-top:20px;font-size:19px;line-height:1.65;color:${C.muted};">
        用正则写下需要保鲜的域名，命中后自动追加时间戳。
      </div>
      <div style="margin-top:26px;background:#fff;border:1px solid #D5E4E4;border-radius:14px;padding:20px 22px;
          box-shadow:0 18px 40px rgba(26,35,50,.08);">
        <div class="mono" style="font-size:16px;color:${C.ink};line-height:2;">
          <div><span style="color:${C.teal};">✓</span> ^api\\.example\\.com$</div>
          <div><span style="color:${C.teal};">✓</span> .*\\.test\\.org</div>
        </div>
        <div style="margin-top:14px;padding-top:14px;border-top:1px dashed #D5E4E4;font-size:15px;color:${C.muted};">
          命中后每次导航都会覆盖为最新的 <span class="mono">t</span> —— 刷新也能拿到新内容，且不会重定向循环。
        </div>
      </div>
    </div>
    <div style="flex:1;display:flex;justify-content:center;">
      <div style="border-radius:16px;overflow:hidden;background:#fff;max-height:676px;
        box-shadow:0 34px 70px rgba(26,35,50,.22), 0 0 0 1px rgba(45,139,139,.16);">
        <img src="${ui.options}" style="display:block;width:600px;">
      </div>
    </div>
  </div>`, 1280, 800)
}

function shortcut(ui: Ui, icon: string) {
  return shell(`
  <div style="width:1280px;height:800px;background:
      radial-gradient(760px 560px at 78% 12%, rgba(58,166,166,.16), transparent 60%),
      linear-gradient(180deg,#FFFFFF 0%,#EEF5F5 100%);
      padding:70px 90px;display:flex;align-items:center;gap:70px;color:${C.ink};overflow:hidden;">

    <div style="flex:1;">
      <div style="font-size:15px;font-weight:700;letter-spacing:2px;color:${C.teal};">ONE-KEY TOGGLE</div>
      <div style="margin-top:14px;font-size:46px;font-weight:800;line-height:1.15;letter-spacing:-.5px;">
        一个快捷键<br>随时开关
      </div>
      <div style="margin-top:20px;font-size:19px;line-height:1.65;color:${C.muted};">
        在网页上按下自定义组合键即可切换总开关，无需打开设置页，
        右上角会浮出状态提示。
      </div>
      <div style="margin-top:30px;display:flex;gap:12px;">
        <span class="mono" style="font-size:18px;font-weight:700;color:#fff;background:${C.teal};
          padding:12px 20px;border-radius:12px;box-shadow:0 12px 26px rgba(45,139,139,.35);">Ctrl</span>
        <span style="align-self:center;color:#9AAAB4;font-size:20px;">+</span>
        <span class="mono" style="font-size:18px;font-weight:700;color:#fff;background:${C.teal};
          padding:12px 20px;border-radius:12px;box-shadow:0 12px 26px rgba(45,139,139,.35);">Shift</span>
        <span style="align-self:center;color:#9AAAB4;font-size:20px;">+</span>
        <span class="mono" style="font-size:18px;font-weight:700;color:${C.ink};background:#fff;border:1px solid #D5E4E4;
          padding:12px 20px;border-radius:12px;">T</span>
      </div>
    </div>

    <div style="flex:0 0 460px;display:flex;justify-content:center;position:relative;">
      <div style="border-radius:16px;overflow:hidden;box-shadow:0 30px 64px rgba(26,35,50,.24);
        border:1px solid #DCE7E7;">
        <img src="${ui.popup}" style="display:block;width:320px;background:#fff;">
      </div>
      <div style="position:absolute;top:-26px;left:6px;display:flex;align-items:center;gap:12px;
        background:rgba(26,35,50,.94);color:#fff;padding:14px 22px;border-radius:14px;
        box-shadow:0 20px 44px rgba(26,35,50,.4);">
        <img src="${icon}" width="30" height="30" style="border-radius:8px;">
        <span style="font-size:16px;">时印 · 时间戳已开启</span>
      </div>
    </div>
  </div>`, 1280, 800)
}

function promoSmall(icon: string) {
  return shell(`
  <div style="width:440px;height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;
      background:radial-gradient(360px 240px at 80% 0%, rgba(58,166,166,.42), transparent 62%),
      linear-gradient(135deg,${C.navy} 0%,${C.navyDeep} 100%);color:${C.cream};overflow:hidden;">
    <img src="${icon}" width="72" height="72" style="border-radius:18px;box-shadow:0 14px 30px rgba(0,0,0,.45);">
    <div style="font-size:34px;font-weight:800;letter-spacing:-.5px;">时印 <span style="color:${C.seafoam};">TimeSeal</span></div>
    <div style="font-size:15px;color:rgba(241,250,238,.78);">URL 时间戳强制刷新 · 永远加载最新页面</div>
  </div>`, 440, 280)
}

function marquee(icon: string) {
  return shell(`
  <div style="position:relative;width:1400px;height:560px;display:flex;align-items:center;gap:56px;padding:0 110px;
      background:radial-gradient(1000px 680px at 90% -20%, rgba(58,166,166,.40), transparent 62%),
      linear-gradient(135deg,${C.navy} 0%,${C.navyDeep} 100%);color:${C.cream};overflow:hidden;">
    <div style="position:absolute;inset:0;opacity:.10;
      background-image:radial-gradient(${C.seafoam} 1.8px, transparent 1.8px);background-size:40px 40px;"></div>
    <img src="${icon}" width="150" height="150" style="position:relative;z-index:2;border-radius:36px;box-shadow:0 26px 60px rgba(0,0,0,.5);">
    <div style="position:relative;z-index:2;">
      <div style="font-size:78px;font-weight:800;letter-spacing:-1.5px;line-height:1.05;">
        时印 <span style="color:${C.seafoam};">TimeSeal</span>
      </div>
      <div style="margin-top:16px;font-size:30px;color:${C.seafoam};font-weight:500;">
        给 URL 盖上此刻的时间戳，永远加载最新页面
      </div>
      <div style="margin-top:18px;font-size:20px;color:rgba(241,250,238,.7);">
        正则匹配域名 · 强制追加 ?t= 时间戳 · 绕过缓存 · 一键开关
      </div>
    </div>
  </div>`, 1400, 560)
}

async function compose(name: string, html: string, w: number, h: number) {
  const browser = await chromium.launch({ channel: 'chromium', headless: true })
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(outDir, name) })
  await browser.close()
  console.log('  wrote', name)
}

async function main() {
  await fs.ensureDir(outDir)
  console.log('› capturing extension UI…')
  const ui = await captureUi()
  const icon = await dataUri(path.join(rootDir, 'extension/assets/icon.svg'))

  console.log('› composing store images…')
  await compose('screenshot-1-hero.png', hero(ui, icon), 1280, 800)
  await compose('screenshot-2-domains.png', domains(ui), 1280, 800)
  await compose('screenshot-3-shortcut.png', shortcut(ui, icon), 1280, 800)
  await compose('promo-small-440x280.png', promoSmall(icon), 440, 280)
  await compose('promo-marquee-1400x560.png', marquee(icon), 1400, 560)

  await fs.copy(path.join(rootDir, 'extension/assets/icon-128.png'), path.join(outDir, 'icon-128.png'))
  await fs.remove(rawDir)
  console.log('✓ store assets ready in store/')
}

await main()
