# 安装与签名（Firefox）

## 为什么会出现「This add-on could not be installed because it appears to be corrupt.」

Firefox **正式版 / Beta 只安装已签名的扩展**。未签名的 `.xpi` 或清单不合法时，
Firefox 都报同一句笼统的 *appears to be corrupt*，所以这句话基本等价于
「签名校验没过」，而不是压缩包真的坏了。

本次踩到的两个原因：

1. **`extension.xpi` 是 Chromium 构建产物** —— `mise run pack` 原来会无条件跑
   `pack:*`，而 `build` 的默认目标是 `chromium`，于是打进 xpi 的 `manifest.json`
   里是 `background.service_worker` + `side_panel` + `sidePanel` 权限。
   Firefox 不认 `service_worker`，且 MV3 必须有显式 ID，`web-ext lint` 直接报错：

   ```
   ERR BACKGROUND_SERVICE_WORKER_NOFALLBACK  Unsupported "/background/service_worker" …
   ERR ADDON_ID_REQUIRED                     The add-on ID is required in Manifest Version 3 and above.
   ```

2. **没有 META-INF 签名** —— 包内不存在 `META-INF/`，即未签名。

自检命令：

```bash
# 压缩包本身是否完好（应当输出 No errors detected）
unzip -t extension.xpi

# 是否签名
unzip -l extension.xpi | grep META-INF

# Firefox 口径的清单校验（应为 0 error）
web-ext lint --source-dir ./extension
```

## 打包

```bash
mise run pack firefox   # = build firefox + pack:firefox，产出 extension.xpi
mise run pack           # chromium，产出 extension.zip / extension.crx
```

`pack:*` 不再由 `pack` 直接展开，避免用错目标的构建产物打包。

## 安装方式

### 方式一：临时加载（开发调试，不签名）

```bash
mise run start firefox-desktop        # 等价于 web-ext run --source-dir ./extension
```

或手动：`about:debugging#/runtime/this-firefox` → 「临时载入附加组件」→ 选 `extension/manifest.json`。
临时扩展在浏览器重启后失效。

### 方式二：Developer Edition / Nightly + 关签名校验

仅 **Developer Edition / Nightly / ESR** 生效（正式版忽略该设置）：

`about:config` → `xpinstall.signatures.required` → `false`，然后直接拖入 `extension.xpi`。

### 方式三：AMO 签名后在正式版安装（推荐）

1. 在 <https://addons.mozilla.org/developers/addon/api/key/> 生成 API key / secret。
2. 签名：

   ```bash
   mise run sign
   # 或手动：
   WEB_EXT_API_KEY=... WEB_EXT_API_SECRET=... \
     web-ext sign --source-dir ./extension --channel unlisted --artifacts-dir ./store/signed
   ```

   `unlisted` = 自签名分发，不上架商店；上架用 `listed`（会进入人工审核）。
3. 安装 `store/signed/*.xpi`。

> 首次提交前请确认 `src/manifest.ts` 里的 `browser_specific_settings.gecko.id`
> （当前为 `time-seal@lumirelle.github.io`）。同一个 AMO 列表页的 ID 一旦上传即不可更改。
