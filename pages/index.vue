<template>
  <div class="flex flex-col mx-auto w-full">
    <Search @search="onSearchTextChange" :searchText="searchText" />
    <HfhFilterGroup class="mt-4 mb-8" @reset="onFiltersReset">
      <template v-for="filter in filters" :key="filter.id">
        <HfhSelect
          v-if="filter.type === FILTER_TYPE_SELECT"
          :modelValue="filter.value"
          :id="filter.id"
          :label="filter.label"
          :options="filter.options"
          defaultOption="Bitte wählen..."
          @update:modelValue="onFilterChange($event, filter)"
        />
        <div v-if="filter.type === FILTER_TYPE_RANGE">
          <HfhMultiRange
            :min="filter.min"
            :max="filter.max"
            :step="filter.step"
            :modelValue="filter.value"
            :id="filter.id"
            :label="filter.label"
            :startLabel="filter.startLabel"
            :endLabel="filter.endLabel"
            @update:modelValue="onFilterChange($event, filter)"
            :formattingCallback="getFilterFormat(filter.format)"
          ></HfhMultiRange>
        </div>
      </template>
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
import debounce from "lodash.debounce";
import { onMounted } from "vue";
import {
  FILTER_FORMAT_TIME,
  FILTER_TYPE_RANGE,
  FILTER_TYPE_SELECT,
} from "../consts";
import {
  HfhFilterGroup,
  HfhSelect,
  HfhMultiRange,
} from "@hfh-dlc/hfh-styleguide";
import { secondsToString } from "../helpers";

const range = ref();

const route = useRoute();

const {
  clips,
  filters,
  setFilter,
  fetchClips,
  fetchFilters,
  searchText,
  loading,
  resetSearchAndFilters,
} = useClips();

const router = useRouter();

const getFilterFormat = (format) => {
  if (format === FILTER_FORMAT_TIME) {
    return secondsToString;
  }
  return (value) => value;
};

const setFiltersFromRoute = () => {
  resetSearchAndFilters();
  searchText.value = route.query.searchText ? route.query.searchText : "";

  filters.value.forEach((filter) => {
    const keys = Object.keys(route.query).filter((key) => {
      return Object.values(filter.params).includes(key);
    });
    if (keys.length > 0) {
      const values = keys.reduce((acc, cur) => {
        const attributeEntry = Object.entries(filter.params).find(
          (entry) => entry[1] == cur
        );
        if (attributeEntry) {
          const attributeName = attributeEntry[0];
          if (keys.length == 1 && attributeName == "value") {
            acc = route.query[cur];
          } else {
            acc[attributeName] = route.query[cur];
          }
        }
        return acc;
      }, {});
      setFilter(filter.id, values);
    }
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
  if (filter.type === FILTER_TYPE_SELECT) {
    query[filter.params.value] = value;
  }
  if (filter.type === FILTER_TYPE_RANGE) {
    query[filter.params.start] = value.start;
    query[filter.params.end] = value.end;
  }
  setFilter(filter.id, value);
  debouncedFilterUpdate(query);
};

const debouncedFilterUpdate = debounce((query) => {
  console.log("debounced");
  router.push({ query });
  fetchClips();
}, 500);

const onFiltersReset = () => {
  router.push({
    query: null,
  });
  resetSearchAndFilters();
  fetchClips();
};

useAsyncData(async () => {
  await fetchFilters();
  setFiltersFromRoute();
  await fetchClips();
});
</script>

<style lang="scss" scoped>
</style>