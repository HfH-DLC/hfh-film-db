<template>
  <div v-if="content">
    <div class="hfh-label">
      {{ label }}
    </div>
    <div>{{ content }}</div>
  </div>
</template>

<script setup>
import { HfhLabel } from "@hfh-dlc/hfh-styleguide";
defineProps({
  label: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.hfh-teaser:hover {
  .hfh-label {
    color: var(--c-white);
  }
}
</style>