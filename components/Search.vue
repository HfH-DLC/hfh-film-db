<template>
  <form @submit.prevent="search" class="relative">
    <div class="flex items-end justify-start gap-4">
      <div>
        <HfhInput
          v-model="inputValue"
          id="search"
          type="search"
          placeholder="Suchbegriff"
          label="Volltextsuche"
        />
      </div>
      <HfhButton type="submit" icon="search" :animated="false"
        >Suchen</HfhButton
      >
    </div>
  </form>
</template>

<script setup>
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
</style>