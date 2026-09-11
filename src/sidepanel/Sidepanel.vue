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
      时印 TimeSeal
    </h1>
    <div class="text-[11px] text-brand-600">
      URL 时间戳强制刷新
    </div>
    <div class="mt-3">
      <span class="opacity-50">时间戳追加：</span>
      <span :class="settings.enabled ? 'text-brand-600 font-semibold' : 'text-gray-400'">
        {{ settings.enabled ? '已开启' : '已关闭' }}
      </span>
    </div>
    <div class="text-xs opacity-60 mt-1">
      命中正则 {{ settings.patterns.length }} 条
    </div>
    <button class="btn mt-3 w-full" @click="openOptionsPage">
      打开设置
    </button>
  </main>
</template>
