<template>
  <div class="flex flex-col mx-auto w-full">
    <Search @search="onSearchTextChange" :searchText="searchText" />
    <HfhFilterGroup class="mt-4 mb-8" @reset="onFiltersReset">
      <HfhSelect
        v-for="filter in filters"
        :key="filter.name"
        :modelValue="filter.value"
        :id="filter.field"
        :name="filter.field"
        :label="filter.label"
        :options="filter.options"
        defaultOption="Bitte wählen..."
        @update:modelValue="onFilterChange($event, filter)"
      />
    </HfhFilterGroup>
    <LoadingIndicator v-if="loading" class="mx-auto" />
    <ul
      v-else-if="clips.length > 0"
      class="grid grid-cols-index-xs sm:grid-cols-index gap-4"
    >
      <li v-for="clip in clips" :key="clip.ClipNummer" class="h-full">
        <NuxtLink
          :to="`/clips/${clip.id}`"
          class="focus-visible:outline-none group"
        >
          <Card :clip="clip" :searchText="searchText" class="h-full" />
        </NuxtLink>
      </li>
    </ul>
    <div v-else class="flex-1 flex items-center justify-center text-xl">
      Für Ihre Suche wurden leider keine passenden Resultate gefunden.
    </div>
  </div>
</template>

<script setup>
import { HfhFilterGroup, HfhSelect } from "@hfh-dlc/hfh-styleguide";
import { onMounted } from "vue";

const route = useRoute();
const { restoreScrollPosition } = useScrollPosition();

const {
  clips,
  filters,
  setFilter,
  fetchClips,
  fetchFilters,
  searchText,
  loading,
} = useClips();

const router = useRouter();

const setFiltersFromRoute = () => {
  searchText.value = route.query.searchText ? route.query.searchText : "";
  Object.entries(route.query)
    .filter(([key]) => key !== "searchText")
    .forEach(([key, value]) => {
      setFilter({ field: key, value: value });
    });
};

const onSearchTextChange = (newValueRef) => {
  const query = { ...route.query, searchText: newValueRef.value };
  router.push({
    query,
  });
  searchText.value = newValueRef.value;
  fetchClips();
};

const onFilterChange = (value, filter) => {
  const query = { ...route.query };
  query[filter.field] = value;
  router.push({
    query,
  });
  router.push({ query });
  setFilter({ field: filter.field, value });
  fetchClips();
};

const onFiltersReset = () => {
  filters.value.forEach((filter) => {
    filter.value = filter.defaultValue;
  });
  searchText.value = "";
  router.push({ query: {} });
  fetchClips();
};

useAsyncData(async () => {
  await fetchFilters();
  setFiltersFromRoute();
  await fetchClips();
  restoreScrollPosition();
});

const onPopState = async () => {
  await fetchFilters();
  setFiltersFromRoute();
  await fetchClips();
};

onMounted(() => {
  window.addEventListener("popstate", onPopState);
});

onBeforeUnmount(() => {
  window.removeEventListener("popstate", onPopState);
});
</script>

<style lang="scss" scoped>
</style>