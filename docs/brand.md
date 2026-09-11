# 时印 TimeSeal · 品牌规范

> 给 URL 盖上此刻的时间戳，永远加载最新页面。

## 名称

| 用途 | 值 |
| --- | --- |
| 中文名 | 时印 |
| 英文名 | TimeSeal |
| 完整标题 | 时印 TimeSeal — URL 时间戳强制刷新 |
| npm 包名 | `time-seal` |
| 仓库 | `webext-enforce-url-timestamp` |
| Slogan | 给 URL 盖上此刻的时间戳，永远加载最新页面 |

命名逻辑：**时**（timestamp）+ **印**（stamp / seal），对应扩展的核心动作 —— 在导航前给命中的 URL
盖上一个 `?t=<毫秒时间戳>`。

## 色板（Ocean Depths）

| 角色 | 名称 | Hex | 用途 |
| --- | --- | --- | --- |
| 背景 / 文字 | Deep Navy | `#1A2332` | 宣传图背景、深色正文 |
| 主色 | Teal | `#2D8B8B` | 按钮、开关、强调、链接 |
| 主色深 | Teal Deep | `#236F6F` | hover / 按下态 |
| 主色亮 | Teal Bright | `#3AA6A6` | 图标渐变起点、光晕 |
| 次色 | Seafoam | `#A8DADC` | 描边、副标题、点缀 |
| 浅底 / 时钟面 | Cream | `#F1FAEE` | 卡片浅底、图标底色 |

UnoCSS 里以 `brand-*` 暴露：`brand-50/100/200/400/600/700/900`（见 `unocss.config.ts`）。

## 字体

- 界面：系统无衬线字体栈（`font-sans`），不额外加载 Web Font。
- 宣传图 / 文档：`Noto Sans CJK SC`；代码与 URL 用等宽字体。

## 图标

- `extension/assets/icon.svg` — 完整版：圆角徽章 + 印章齿圈 + 时钟。
- `extension/assets/icon-small.svg` — 简化版：去掉齿圈、加粗指针，供 16/32px 使用。
- 导出的 PNG：`icon-16/32/48/128/512.png`，由 `rsvg-convert` 从 SVG 生成。
- 最小可用尺寸 16px；深色/浅色背景上均使用同一版本，不描边、不加投影（由容器决定）。

重新生成图标 PNG：

```bash
cd extension/assets
rsvg-convert -w 512 -h 512 icon.svg -o icon-512.png
rsvg-convert -w 128 -h 128 icon.svg -o icon-128.png
rsvg-convert -w 48  -h 48  icon.svg -o icon-48.png
rsvg-convert -w 32  -h 32  icon-small.svg -o icon-32.png
rsvg-convert -w 16  -h 16  icon-small.svg -o icon-16.png
```

## 商店素材

`store/` 下的文件由 `nub scripts/store-assets.ts` 生成：脚本先加载已构建的扩展截取真实界面，
再用 HTML 合成宣传图。

| 文件 | 尺寸 | 用途 |
| --- | --- | --- |
| `icon-128.png` | 128×128 | 商店图标 |
| `screenshot-1-hero.png` | 1280×800 | 主视觉 |
| `screenshot-2-domains.png` | 1280×800 | 域名正则 |
| `screenshot-3-shortcut.png` | 1280×800 | 快捷键开关 |
| `promo-small-440x280.png` | 440×280 | 小型宣传图块 |
| `promo-marquee-1400x560.png` | 1400×560 | 横幅宣传图 |

生成前先构建：`mise run build && nub scripts/store-assets.ts`。
