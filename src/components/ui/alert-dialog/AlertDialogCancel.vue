<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AlertDialogCancel } from 'reka-ui'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const props = defineProps<{
  class?: HTMLAttributes['class']
  asChild?: boolean
}>()
</script>

<template>
  <AlertDialogCancel
    :as-child="asChild"
    :class="cn(buttonVariants({ variant: 'outline' }), props.class)"
  >
    <slot />
  </AlertDialogCancel>
</template>
