<script setup lang="ts">
import { computed, ref } from 'vue'
import { comboFromKeyboardEvent } from '~/logic/shortcut'
import { isValidRegex, settings } from '~/logic/storage'

const newPattern = ref('')

function addPattern() {
  const p = newPattern.value.trim()
  if (!p)
    return
  settings.value.patterns.push(p)
  newPattern.value = ''
}

function removePattern(i: number) {
  settings.value.patterns.splice(i, 1)
}

const invalidCount = computed(() => settings.value.patterns.filter(p => !isValidRegex(p)).length)

// ---- Shortcut recording ----
const recording = ref(false)

function onRecordKeydown(e: KeyboardEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (e.key === 'Escape') {
    settings.value.shortcut = ''
    recording.value = false
    return
  }
  const combo = comboFromKeyboardEvent(e)
  if (!combo)
    return // modifier-only key; wait for the full combo
  settings.value.shortcut = combo
  recording.value = false
}

const shortcutDisplay = computed(() => {
  if (recording.value)
    return 'Press a key combination… (Esc to clear)'
  return settings.value.shortcut || 'Not set (click to record)'
})
</script>

<template>
  <main class="max-w-xl mx-auto px-6 py-8 text-brand-900 font-sans">
    <header class="mb-7 flex items-center gap-3">
      <Logo class="mx-0" :size="44" />
      <div>
        <h1 class="text-xl font-bold mb-0.5">
          TimeSeal
        </h1>
        <p class="text-sm text-brand-600">
          Force-refresh URLs with timestamps
        </p>
      </div>
    </header>

    <p class="text-sm text-gray-500 mb-6">
      Pages matching a domain regex are forced to navigate to a URL carrying the latest <code class="bg-gray-100 px-1 rounded">?t=&lt;current epoch ms&gt;</code> before every navigation -- refresh, back/forward and re-clicking a link all overwrite the old timestamp.
    </p>

    <!-- Master switch -->
    <section class="mb-8">
      <label class="flex items-center justify-between p-4 rounded-lg border cursor-pointer" :class="settings.enabled ? 'border-brand-600 bg-brand-50' : 'border-gray-300 bg-gray-50'">
        <div>
          <div class="font-semibold">Append timestamps</div>
          <div class="text-xs text-gray-500 mt-0.5">When off, no navigation is rewritten</div>
        </div>
        <button
          role="switch"
          :aria-checked="settings.enabled"
          class="relative w-12 h-6 rounded-full transition-colors shrink-0"
          :class="settings.enabled ? 'bg-brand-600' : 'bg-gray-300'"
          @click="settings.enabled = !settings.enabled"
        >
          <span
            class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
            :class="settings.enabled ? 'translate-x-6' : ''"
          />
        </button>
      </label>
    </section>

    <!-- Domain regex list -->
    <section class="mb-8">
      <div class="flex items-center justify-between mb-2">
        <h2 class="font-semibold">
          Domain regexes ({{ settings.patterns.length }})
        </h2>
        <span v-if="invalidCount" class="text-xs text-red-600">{{ invalidCount }} invalid</span>
      </div>

      <div
        v-for="(p, i) in settings.patterns"
        :key="i"
        class="flex items-center gap-2 mb-2"
      >
        <span class="text-gray-400 text-xs w-6 text-right shrink-0">{{ i + 1 }}.</span>
        <input
          v-model="settings.patterns[i]"
          placeholder="e.g. .*\.example\.com"
          class="flex-1 border rounded px-2 py-1.5 text-sm font-mono focus:outline-none"
          :class="isValidRegex(p) ? 'border-gray-300 focus:border-brand-600' : 'border-red-400 bg-red-50'"
        >
        <button
          class="w-7 h-7 rounded-full bg-red-100 text-red-600 hover:bg-red-200 font-bold shrink-0"
          title="Remove this entry"
          @click="removePattern(i)"
        >
          −
        </button>
      </div>

      <div class="flex items-center gap-2 mt-3">
        <input
          v-model="newPattern"
          placeholder="Enter a new domain regex, e.g. ^api\.example\.com$"
          class="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm font-mono focus:outline-none focus:border-brand-600"
          @keydown.enter="addPattern"
        >
        <button
          class="w-7 h-7 rounded-full bg-brand-600 text-white hover:bg-brand-700 font-bold shrink-0"
          title="Add"
          @click="addPattern"
        >
          +
        </button>
      </div>
      <p class="text-xs text-gray-400 mt-2">
        Regexes match the URL hostname, e.g. <code>.*\.example\.com</code> matches all its subdomains. All changes are saved automatically.
      </p>
    </section>

    <!-- Shortcut -->
    <section>
      <h2 class="font-semibold mb-2">
        Toggle shortcut
      </h2>
      <div
        tabindex="0"
        class="w-full border rounded px-3 py-2 text-sm cursor-pointer select-none"
        :class="recording ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-300'"
        @click="recording = true"
        @keydown="recording && onRecordKeydown($event)"
        @blur="recording = false"
      >
        {{ shortcutDisplay }}
      </div>
      <p class="text-xs text-gray-400 mt-2">
        Press this key combination on any web page to toggle the switch at any time (no need to open the settings page). Empty by default, which disables the shortcut. Only works on regular web pages, not on browser-internal pages.
      </p>
    </section>

    <footer class="mt-10 pt-4 border-t border-gray-200 text-xs text-gray-400 flex items-center justify-between">
      <span>TimeSeal · Keep every URL fresh</span>
      <a
        class="hover:text-brand-600"
        href="https://github.com/lumirelle/webext-enforce-url-timestamp"
        target="_blank"
        rel="noreferrer"
      >GitHub</a>
    </footer>
  </main>
</template>
