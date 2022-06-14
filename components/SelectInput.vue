<template>
  <div class="relative w-full md:w-auto">
    <label
      class="
        block
        mb-0.5
        text-xs
        font-bold
        uppercase
        text-thunderbird-red
        px-1.5
        leading-6
        absolute
        -top-3
        left-2
        bg-white
      "
      for="search"
      >{{ label }}</label
    >
    <select
      :id="id"
      :name="id"
      class="
        mb-6
        py-0
        pr-10
        pl-5
        w-full
        border-2 border-thunderbird-red
        appearance-none
        text-lg
        bg-white bg-dropdown-arrow bg-no-repeat bg-right bg-size-arrow
        h-14
      "
      @change="onChange"
    >
      <option selected value>Bitte wählen...</option>
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
        :selected="option.value === value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  computed: {
    id() {
      return `filter-select-${this.name}`;
    },
  },
  methods: {
    onChange(event) {
      this.$emit("input", event.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>