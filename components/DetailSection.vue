<template>
  <div class="mt-4">
    <div
      class="
        uppercase
        text-xs
        font-bold
        text-thunderbird-red
        group-hover:text-white
        group-focus-visible:text-white
      "
    >
      {{ label }}
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>