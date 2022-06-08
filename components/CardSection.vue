<template>
  <div v-if="content">
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
    <div v-html="content" />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
</style>