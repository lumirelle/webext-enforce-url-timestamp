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

// ---- 快捷键录制 ----
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
    return // 纯修饰键，等待完整组合
  settings.value.shortcut = combo
  recording.value = false
}

const shortcutDisplay = computed(() => {
  if (recording.value)
    return '按下组合键…（Esc 清除）'
  return settings.value.shortcut || '未设置（点击录制）'
})
</script>

<template>
  <main class="max-w-xl mx-auto px-6 py-8 text-brand-900 font-sans">
    <header class="mb-7 flex items-center gap-3">
      <Logo class="mx-0" :size="44" />
      <div>
        <h1 class="text-xl font-bold mb-0.5">
          时印 TimeSeal
        </h1>
        <p class="text-sm text-brand-600">
          URL 时间戳强制刷新
        </p>
      </div>
    </header>

    <p class="text-sm text-gray-500 mb-6">
      命中域名正则的页面，导航前会被强制跳转到追加了 <code class="bg-gray-100 px-1 rounded">?t=&lt;当前毫秒时间戳&gt;</code> 的 URL；已带 <code class="bg-gray-100 px-1 rounded">t</code> 参数的 URL 不处理。
    </p>

    <!-- 总开关 -->
    <section class="mb-8">
      <label class="flex items-center justify-between p-4 rounded-lg border cursor-pointer" :class="settings.enabled ? 'border-brand-600 bg-brand-50' : 'border-gray-300 bg-gray-50'">
        <div>
          <div class="font-semibold">启用时间戳追加</div>
          <div class="text-xs text-gray-500 mt-0.5">关闭后所有页面导航不做改写</div>
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

    <!-- 域名正则列表 -->
    <section class="mb-8">
      <div class="flex items-center justify-between mb-2">
        <h2 class="font-semibold">
          域名正则（{{ settings.patterns.length }} 条）
        </h2>
        <span v-if="invalidCount" class="text-xs text-red-600">{{ invalidCount }} 条正则无效</span>
      </div>

      <div
        v-for="(p, i) in settings.patterns"
        :key="i"
        class="flex items-center gap-2 mb-2"
      >
        <span class="text-gray-400 text-xs w-6 text-right shrink-0">{{ i + 1 }}.</span>
        <input
          v-model="settings.patterns[i]"
          placeholder="例如 .*\.example\.com"
          class="flex-1 border rounded px-2 py-1.5 text-sm font-mono focus:outline-none"
          :class="isValidRegex(p) ? 'border-gray-300 focus:border-brand-600' : 'border-red-400 bg-red-50'"
        >
        <button
          class="w-7 h-7 rounded-full bg-red-100 text-red-600 hover:bg-red-200 font-bold shrink-0"
          title="删除此条"
          @click="removePattern(i)"
        >
          −
        </button>
      </div>

      <div class="flex items-center gap-2 mt-3">
        <input
          v-model="newPattern"
          placeholder="输入新的域名正则，如 ^api\.example\.com$"
          class="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm font-mono focus:outline-none focus:border-brand-600"
          @keydown.enter="addPattern"
        >
        <button
          class="w-7 h-7 rounded-full bg-brand-600 text-white hover:bg-brand-700 font-bold shrink-0"
          title="添加"
          @click="addPattern"
        >
          +
        </button>
      </div>
      <p class="text-xs text-gray-400 mt-2">
        正则对 URL 的 hostname 匹配，如 <code>.*\.example\.com</code> 匹配其所有子域。所有修改自动保存。
      </p>
    </section>

    <!-- 快捷键 -->
    <section>
      <h2 class="font-semibold mb-2">
        开关切换快捷键
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
        在网页上按此组合键可随时切换开关（无需打开设置页）。默认为空，即不启用快捷键。仅在普通网页生效，浏览器内部页面无效。
      </p>
    </section>

    <footer class="mt-10 pt-4 border-t border-gray-200 text-xs text-gray-400 flex items-center justify-between">
      <span>时印 TimeSeal · 让 URL 永远保持新鲜</span>
      <a
        class="hover:text-brand-600"
        href="https://github.com/lumirelle/webext-enforce-url-timestamp"
        target="_blank"
        rel="noreferrer"
      >GitHub</a>
    </footer>
  </main>
</template>
