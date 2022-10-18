<template>
  <svg
    :class="`direction--${direction}`"
    width="0.625rem"
    height="1rem"
    viewBox="0 0 10 16"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline
      points="21 17 28 24 21 31"
      transform="translate(-20.000000, -16.000000)"
      stroke="#BE1925"
      stroke-width="2"
      fill="none"
      fill-rule="evenodd"
    ></polyline>
  </svg>
</template>

<script setup>
const props = defineProps({
  direction: {
    type: String,
    default: "right",
    validator: (value) => ["right", "left"].includes(value),
  },
});
</script>

<style lang="scss" scoped>
.direction--left {
  transform: rotate(180deg);
}
</style>