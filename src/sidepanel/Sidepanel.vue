<script setup lang="ts">
import { settings } from '~/logic/storage'

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main class="w-full px-4 py-5 text-center text-gray-700">
    <Logo />
    <div class="mt-2">
      <span class="opacity-50">时间戳追加：</span>
      <span :class="settings.enabled ? 'text-teal-600 font-semibold' : 'text-gray-400'">
        {{ settings.enabled ? '已开启' : '已关闭' }}
      </span>
    </div>
    <div class="text-xs opacity-60 mt-1">
      命中正则 {{ settings.patterns.length }} 条
    </div>
    <button class="btn mt-3" @click="openOptionsPage">
      打开设置
    </button>
  </main>
</template>
