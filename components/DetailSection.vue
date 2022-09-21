<template>
  <div class="mt-4">
    <div class="hfh-label">
      {{ label }}
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { HfhLabel } from "@hfh-dlc/hfh-styleguide";
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
</style>