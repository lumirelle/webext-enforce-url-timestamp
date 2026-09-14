# Installation and signing (Firefox)

## Why you see "This add-on could not be installed because it appears to be corrupt."

Firefox **stable / Beta only installs signed extensions**. For an unsigned `.xpi` or an invalid
manifest, Firefox reports the same generic *appears to be corrupt* message, so it effectively
means "signature verification failed", not that the archive is genuinely broken.

The two causes hit while setting this up:

1. **`extension.xpi` was a Chromium build artifact** -- `mise run pack` used to run `pack:*`
   unconditionally, while the default `build` target is `chromium`, so the `manifest.json`
   inside the xpi contained `background.service_worker` + `side_panel` + the `sidePanel`
   permission. Firefox doesn't recognize `service_worker`, and MV3 requires an explicit ID, so
   `web-ext lint` fails outright:

   ```
   ERR BACKGROUND_SERVICE_WORKER_NOFALLBACK  Unsupported "/background/service_worker" …
   ERR ADDON_ID_REQUIRED                     The add-on ID is required in Manifest Version 3 and above.
   ```

2. **No META-INF signature** -- there is no `META-INF/` in the package, i.e. it is unsigned.

Self-check commands:

```bash
# whether the archive itself is intact (should print No errors detected)
unzip -t extension.xpi

# whether it is signed
unzip -l extension.xpi | grep META-INF

# manifest validation from Firefox's point of view (should be 0 errors)
web-ext lint --source-dir ./extension
```

## Packaging

```bash
mise run pack firefox   # = build firefox + pack:firefox, produces extension.xpi
mise run pack           # chromium, produces extension.zip / extension.crx
```

`pack:*` is no longer expanded directly by `pack`, to avoid packaging the wrong target's build.

## Installation methods

### Option 1: Temporary load (development, unsigned)

```bash
mise run start firefox-desktop        # equivalent to web-ext run --source-dir ./extension
```

Or manually: `about:debugging#/runtime/this-firefox` -> "Load Temporary Add-on" -> select
`extension/manifest.json`. Temporary extensions are removed when the browser restarts.

### Option 2: Developer Edition / Nightly + signature check disabled

Only works on **Developer Edition / Nightly / ESR** (stable ignores this setting):

`about:config` -> `xpinstall.signatures.required` -> `false`, then drag in `extension.xpi`.

### Option 3: Sign via AMO and install on stable (recommended)

1. Generate an API key / secret at <https://addons.mozilla.org/developers/addon/api/key/>.
2. Sign:

   ```bash
   mise run sign
   # or manually:
   WEB_EXT_API_KEY=... WEB_EXT_API_SECRET=... \
     web-ext sign --source-dir ./extension --channel unlisted --artifacts-dir ./store/signed
   ```

   `unlisted` = self-distributed signing, not listed on the store; use `listed` for the store
   (which goes through manual review).
3. Install `store/signed/*.xpi`.

> Before the first submission, confirm `browser_specific_settings.gecko.id` in
> `src/manifest.ts` (currently `time-seal@lumirelle.github.io`). The ID of an AMO listing can
> never be changed once uploaded.
