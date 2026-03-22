<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AlertDialogDescription } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  asChild?: boolean
}>()
</script>

<template>
  <AlertDialogDescription
    :as-child="asChild"
    :class="cn('text-muted-foreground text-sm', props.class)"
  >
    <slot />
  </AlertDialogDescription>
</template>
