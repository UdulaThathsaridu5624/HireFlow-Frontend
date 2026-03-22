<script setup lang="ts">
import { AlertDialogTrigger } from 'reka-ui'

const props = defineProps<{
  asChild?: boolean
}>()
</script>

<template>
  <AlertDialogTrigger v-bind="props">
    <slot />
  </AlertDialogTrigger>
</template>
