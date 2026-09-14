<script setup lang="ts">
import { settings } from '~/logic/storage'

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main class="w-full px-4 py-5 text-center text-brand-900">
    <Logo :size="52" />
    <h1 class="mt-2 text-base font-bold leading-tight">
      TimeSeal
    </h1>
    <div class="text-[11px] text-brand-600">
      Force-refresh URLs with timestamps
    </div>
    <div class="mt-3">
      <span class="opacity-50">Timestamp appending:</span>
      <span :class="settings.enabled ? 'text-brand-600 font-semibold' : 'text-gray-400'">
        {{ settings.enabled ? 'On' : 'Off' }}
      </span>
    </div>
    <div class="text-xs opacity-60 mt-1">
      {{ settings.patterns.length }} matching regex
    </div>
    <button class="btn mt-3 w-full" @click="openOptionsPage">
      Open Settings
    </button>
  </main>
</template>
