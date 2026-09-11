# Starter WebExt

A [Vite](https://vitejs.dev/) powered WebExtension ([Chrome](https://developer.chrome.com/docs/extensions/reference/), [FireFox](https://addons.mozilla.org/en-US/developers/), etc.) starter template.

<p align="center">
<sub>Popup</sub><br/>
<img width="655" src="https://user-images.githubusercontent.com/11247099/126741643-813b3773-17ff-4281-9737-f319e00feddc.png" alt=""><br/>
<sub>Options Page</sub><br/>
<img width="655" src="https://user-images.githubusercontent.com/11247099/126741653-43125b62-6578-4452-83a7-bee19be2eaa2.png" alt=""><br/>
<sub>Inject Vue App into the Content Script</sub><br/>
<img src="https://user-images.githubusercontent.com/11247099/130695439-52418cf0-e186-4085-8e19-23fe808a274e.png" alt="">
</p>

## Features

- ⚡️ **Instant HMR** - use **Vite** on dev (no more refresh!)
- 🥝 Vue 3 - Composition API, [`<script setup>` syntax](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md) and more!
- 💬 Effortless communications - powered by [`webext-bridge`](https://github.com/serversideup/webext-bridge) and [VueUse](https://github.com/antfu/vueuse) storage
- 🌈 [UnoCSS](https://github.com/unocss/unocss) - The instant on-demand Atomic CSS engine.
- 🦾 [TypeScript](https://www.typescriptlang.org/) - type safe
- 📦 [Components auto importing](./src/components)
- 🌟 [Icons](./src/components) - Access to icons from any iconset directly
- 🖥 Content Script - Use Vue even in content script
- 🌍 WebExtension - isomorphic extension for Chrome, Firefox, and others
- 📃 Dynamic `manifest.json` with full type support

## Pre-packed

### WebExtension Libraries

- [`webextension-polyfill`](https://github.com/mozilla/webextension-polyfill) - WebExtension browser API Polyfill with types
- [`webext-bridge`](https://github.com/serversideup/webext-bridge) - effortlessly communication between contexts

### Vite Plugins

- [`unplugin-auto-import`](https://github.com/unplugin/unplugin-auto-import) - Directly use `browser` and Vue Composition API without importing
- [`unplugin-vue-components`](https://github.com/unplugin/unplugin-vue-components) - components auto import
- [`unplugin-icons`](https://github.com/unplugin/unplugin-icons) - icons as components
  - [Iconify](https://iconify.design) - use icons from any icon sets [🔍Icônes](https://icones.netlify.app/)

### Vue Plugins

- [VueUse](https://github.com/antfu/vueuse) - collection of useful composition APIs

### UI Frameworks

- [UnoCSS](https://github.com/unocss/unocss) - the instant on-demand Atomic CSS engine

### Coding Style

- Use Composition API with [`<script setup>` SFC syntax](https://github.com/vuejs/rfcs/pull/227)
- [ESLint](https://eslint.org/) with [@antfu/eslint-config](https://github.com/antfu/eslint-config), single quotes, no semi
- [oxlint](https://oxc.rs/) type-aware rules via [@lumirelle/oxlint-config](https://github.com/lumirelle/oxlint-config)

### Dev tools

- [mise](https://mise.jdx.dev/) - toolchain manager and task runner
- [nub](https://nubjs.com/) - fast Node.js package manager
- [hk](https://github.com/jdx/hk) - git hooks and lint runner
- [TypeScript](https://www.typescriptlang.org/)
- [web-ext](https://github.com/mozilla/web-ext) - streamlined experience for developing web extensions

## Use the Template

### GitHub Template

[Create a repo from this template on GitHub](https://github.com/lumirelle/starter-webext/generate).

### Clone to local

If you prefer to do it manually with the cleaner git history:

```bash
npx degit lumirelle/starter-webext my-webext
cd my-webext
mise install
mise run build
```

[mise](https://mise.jdx.dev/) installs the pinned toolchain, and the Node.js dependencies are installed through [nub](https://nubjs.com/) as part of `mise run` (see `[deps.nub]` in `mise.toml`).

## Usage

### Folders

- `src` - main source.
  - `contentScript` - scripts and components to be injected as `content_script`
  - `background` - scripts for background.
  - `components` - auto-imported Vue components that are shared in popup and options page.
  - `styles` - styles shared in popup and options page
  - `assets` - assets used in Vue components
  - `manifest.ts` - manifest for the extension.
- `extension` - extension package root.
  - `assets` - static assets (mainly for `manifest.json`).
  - `dist` - built files, also serve stub entry for Vite on development.
- `scripts` - development and bundling helper scripts.

### Development

```bash
mise run dev            # Chromium (default)
mise run dev firefox    # Firefox
```

Then **load extension in browser with the `extension/` folder**.

`web-ext` can also run the extension for you, reloading it whenever `extension/` changes:

```bash
mise run start chromium
mise run start firefox-desktop
```

`start` runs whatever is currently in `extension/`, so it must match the browser you
built for (`dev`/`build` default to Chromium). A mismatch is detected and reported.

> While Vite handles HMR automatically in the most of the case, [Extensions Reloader](https://chromewebstore.google.com/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) is still recommended for cleaner hard reloading.

### Build

To build the extension, run:

```bash
mise run build          # Chromium (default)
mise run build firefox  # Firefox
```

Then pack the files under `extension` into the store artifacts:

```bash
mise run pack   # produces extension.zip, extension.crx and extension.xpi
```

You can upload `extension.crx` or `extension.xpi` to the appropriate extension store.

### Checks and tests

```bash
mise run check      # oxlint, tsc, eslint, stylua and pkl
mise run fix        # auto-fix everything that can be fixed
mise run test       # unit tests with Vitest
mise run test:e2e   # end-to-end tests with Playwright
```

## Using Gitpod

If you have a web browser, you can get a fully pre-configured development environment with one click:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/lumirelle/starter-webext)

## Variations

This is a variant of [Vitesse](https://github.com/antfu/vitesse), check out the [full variations list](https://github.com/antfu/vitesse#variations).
