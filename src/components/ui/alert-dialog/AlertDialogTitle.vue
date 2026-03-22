<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AlertDialogTitle } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  asChild?: boolean
}>()
</script>

<template>
  <AlertDialogTitle
    :as-child="asChild"
    :class="cn('text-lg leading-none font-semibold', props.class)"
  >
    <slot />
  </AlertDialogTitle>
</template>
