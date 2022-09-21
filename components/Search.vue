<template>
  <form @submit.prevent="search" class="relative">
    <div class="flex items-end justify-start gap-4">
      <div>
        <HfhInput
          v-model="inputValue"
          id="search"
          type="search"
          placeholder="Suchbegriff"
          label="Suche"
        />
      </div>
      <HfhButton type="submit" icon="search" :animated="false"
        >Suchen</HfhButton
      >
    </div>
  </form>
</template>

<script setup>
import { reactive } from "vue";
import { HfhButton, HfhInput } from "@hfh-dlc/hfh-styleguide";
const emit = defineEmits(["search"]);
const props = defineProps({
  searchText: {
    type: String,
    default: "",
  },
});
const inputValue = ref(props.searchText);

watch(
  () => props.searchText,
  (newVal) => {
    inputValue.value = newVal;
  }
);

const search = () => {
  emit("search", inputValue);
};
</script>

<style scoped>
.search-icon {
  @apply bg-search bg-no-repeat bg-size-search bg-pos-search;
}
.search-icon:hover,
.search-icon:focus {
  @apply bg-search-active;
}
</style>