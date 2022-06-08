<template>
  <div class="flex flex-col mx-auto p-4 w-full">
    <Search class="sm:mx-4" @submit="searchClips" />
    <div class="flex flex-wrap gap-x-4 sm:mx-4 mt-4">
      <SelectInput
        v-for="filter in filters"
        :key="filter.name"
        :value="filter.value"
        class="mt-4 w-48"
        :name="filter.field"
        :label="filter.label"
        :options="filter.options"
        @input="onFilterChange($event, filter)"
      />
    </div>
    <div v-if="loading" class="flex justify-center items-center flex-1">
      <LoadingIndicator />
    </div>
    <ul
      v-else-if="clips.length > 0"
      class="grid grid-cols-index-xs sm:grid-cols-index gap-4 sm:px-4"
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

<script>
export default {
  data() {
    return {
      searchText: "",
    };
  },
  async fetch() {
    await this.$store.dispatch("fetchFilters");
    return this.fetchClips();
  },
  computed: {
    clips() {
      return this.$store.state.clips;
    },
    filters() {
      return this.$store.state.filters;
    },
    loading() {
      return this.$store.state.loading;
    },
    searchParams() {
      let params = {};
      if (this.searchText) {
        params.searchText = this.searchText;
      }
      const activeFilters = this.filters.filter((filter) => filter.value);
      if (activeFilters.length > 0) {
        const filterParams = {
          ...activeFilters.reduce((acc, cur) => {
            acc[`${cur.field}`] = cur.value;
            return acc;
          }, {}),
        };
        params = {
          ...params,
          ...filterParams,
        };
      }
      return params;
    },
  },
  methods: {
    async searchClips({ text }) {
      this.searchText = text;
      await this.fetchClips();
    },
    async fetchClips() {
      await this.$store.dispatch(
        "fetchClips",
        new URLSearchParams(this.searchParams)
      );
    },
    async onFilterChange(value, filter) {
      this.$store.commit("setFilter", { field: filter.field, value });
      await this.fetchClips();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>