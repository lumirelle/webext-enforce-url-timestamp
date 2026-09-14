<script setup lang="ts">
import logo from '~/assets/logo.svg'

withDefaults(defineProps<{ size?: number }>(), { size: 48 })
</script>

<template>
  <a
    class="inline-block cursor-pointer select-none transition duration-200 ease-in-out opacity-90 hover:opacity-100"
    rel="noreferrer"
    href="https://github.com/lumirelle/webext-enforce-url-timestamp"
    target="_blank"
    title="TimeSeal · GitHub"
  >
    <img
      :src="logo"
      alt="TimeSeal"
      :width="size"
      :height="size"
      class="rounded-lg"
    >
  </a>
</template>
