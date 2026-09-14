<div align="center">

<img src="./extension/assets/icon-512.png" width="112" alt="时印 TimeSeal">

# 时印 TimeSeal

**给 URL 盖上此刻的时间戳，永远加载最新页面。**

命中域名的页面在导航前被强制改写为 `?t=<当前毫秒时间戳>`，
绕过浏览器与 CDN 缓存，让你始终拿到最新内容。

[![Chrome](https://img.shields.io/badge/Chrome-MV3-2D8B8B?logo=googlechrome&logoColor=white)](#安装)
[![Firefox](https://img.shields.io/badge/Firefox-MV3-2D8B8B?logo=firefoxbrowser&logoColor=white)](#安装)
[![MIT](https://img.shields.io/badge/License-MIT-1A2332.svg)](./LICENSE)

<img src="./store/screenshot-1-hero.png" width="880" alt="时印 TimeSeal 主视觉">

</div>

## 它解决什么问题

开发调试或内容运维时，经常遇到「页面/接口明明更新了，浏览器或 CDN 却还在返回旧内容」。
手动在地址栏补 `?t=123456` 很麻烦，而且下一次跳转又被缓存。

**时印**把这件事自动化：给需要保鲜的域名配一条正则，之后每次导航都会自动追加当前时间戳，
缓存自然失效。

## 功能

- ⏱ **导航前强制追加时间戳** —— 借助 `webNavigation.onBeforeNavigate`，主框架导航前就把 URL
  改写为 `?t=<毫秒时间戳>`，页面还没开始加载缓存就已失效。
- 🎯 **按域名正则匹配** —— 对 `hostname` 做正则匹配，例如 `.*\.example\.com` 命中所有子域；
  只影响你指定的站点，其他网站零打扰。
- 🔁 **实时刷新、不会死循环** —— 每次导航（刷新、前进/后退、再次点链接）都会覆盖为新的
  时间戳；由 per-tab 守卫识别并放行扩展自身发起的改写，不会无限重定向。
- 🎚 **一键总开关** —— 弹窗/Sidepanel 里有开关，也可以录制一个全局组合键（如 `Ctrl+Shift+T`），
  在任意网页上随时切换，右上角浮出状态提示。
- 💾 **自动保存** —— 配置存于 `browser.storage`，跨设备（登录同步时）保留。
- 🌍 **Chromium 与 Firefox 通用** —— 同一份代码，MV3。

<div align="center">
<img src="./store/screenshot-2-domains.png" width="640" alt="域名正则配置">
<img src="./store/screenshot-3-shortcut.png" width="640" alt="快捷键开关">
</div>

## 安装

### 商店

> 上架后在此补充 Chrome Web Store / Firefox Add-ons 链接。

### 从源码加载（开发者模式）

```bash
git clone https://github.com/lumirelle/webext-enforce-url-timestamp
cd webext-enforce-url-timestamp
mise install
mise run build            # Chromium
mise run build firefox    # Firefox
```

- **Chrome / Edge**：打开 `chrome://extensions`，开启「开发者模式」，选择「加载已解压的扩展程序」，
  指向本仓库的 `extension/` 目录。
- **Firefox**：打开 `about:debugging#/runtime/this-firefox`，「临时载入附加组件」，
  选择 `extension/manifest.json`。

### 打包 / 签名（Firefox）

```bash
mise run pack firefox   # → extension.xpi（未签名）
mise run pack           # → extension.zip / extension.crx（Chromium）
mise run sign           # 上传 AMO 签名，需 WEB_EXT_API_KEY / WEB_EXT_API_SECRET
```

> Firefox 正式版只接受**已签名**的扩展；未签名的 xpi 会报
> *“This add-on could not be installed because it appears to be corrupt.”*。
> 另外注意：xpi 必须由 **firefox** 目标构建产出，Chromium 构建的 manifest 里是
> `background.service_worker`，Firefox 同样拒绝。详见 [docs/signing.md](./docs/signing.md)。

## 使用

1. 点击工具栏里的时印图标，选择「打开设置」。
2. 在 **域名正则** 里填入需要保鲜的域名，例如：
   - `^api\.example\.com$` —— 精确匹配
   - `.*\.example\.com` —— 匹配所有子域
   - `localhost:\d+` —— 注意：正则作用于 `hostname`，不含端口
3. 页面命中规则后，导航会自动变成 `https://api.example.com/v1/users?t=1735689600000`。
4. 想临时关掉时，用弹窗里的开关，或在设置页录制一个 **开关切换快捷键**。

> `t` 参数名固定；每次导航（含刷新、前进/后退）都会覆盖为当前时间戳。

## 工作原理

```
webNavigation.onBeforeNavigate (frameId === 0)
        │
        ├─ 跳过浏览器内部页 / 商店页
        ├─ 等待 storage 就绪
        ├─ 总开关关闭？→ 结束
        ├─ hostname 命中任一正则？
        ├─ 该 URL 是我们刚写入的？→ 放行（防循环）
        └─ 否则 → tabs.update(覆盖 ?t=Date.now())
```

核心改写逻辑是纯函数 `appendTimestamp()`（`src/logic/timestamp.ts`），防循环守卫是
`createRewriteGuard()`（`src/logic/rewriteGuard.ts`），都不依赖浏览器 API，因此可以完整单测。

## 开发

项目使用 [mise](https://mise.jdx.dev/) 管理工具链与任务、[nub](https://nubjs.com/) 安装依赖。

```bash
mise run dev              # 开发（Chromium，带 HMR）
mise run dev firefox      # 开发（Firefox）

mise run build            # 构建（Chromium）
mise run build firefox    # 构建（Firefox）
mise run pack             # 打包成 extension.zip / .crx / .xpi

mise run check            # oxlint + tsc + eslint + stylua + pkl
mise run fix              # 自动修复
mise run test             # Vitest 单元测试
mise run test:e2e         # Playwright 端到端测试

nub scripts/store-assets.ts   # 重新生成 store/ 商店素材（需先 build）
```

### 目录结构

```
src/
├── background/        # service worker：导航改写 + 快捷键消息
├── contentScripts/    # 页面内快捷键监听 + toast
├── options/           # 设置页（域名正则、快捷键录制）
├── popup/             # 工具栏弹窗
├── sidepanel/         # 侧边栏面板
├── logic/             # 纯逻辑：timestamp / shortcut / storage
├── components/        # 自动导入的共享组件
└── manifest.ts        # 动态生成 manifest.json
extension/             # 扩展包根目录（assets + dist）
scripts/               # 构建、manifest、商店素材脚本
store/                 # 生成好的商店图片
docs/brand.md          # 品牌规范（配色 / 图标 / 素材）
```

## 技术栈

Vite · Vue 3 · TypeScript · UnoCSS · webext-bridge · webextension-polyfill ·
Vitest · Playwright。模板基于 [starter-webext](https://github.com/lumirelle/starter-webext)。

## License

[MIT](./LICENSE)
