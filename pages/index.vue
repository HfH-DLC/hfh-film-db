<template>
  <div class="bg-white">
    <h1 class="text-2xl block p-4 text-thunderbird-red">Filmclips</h1>
    <Search class="mx-4" @submit="searchClips" />
    <ul class="grid grid-cols-4 gap-4 p-4">
      <li v-for="clip in clips" :key="clip.ClipNummer" class="h-full">
        <NuxtLink :to="`/clips/${clip.id}`">
          <Card :clip="clip" :searchText="searchText" class="h-full" />
        </NuxtLink>
      </li>
    </ul>
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
    return this.fetchClips();
  },
  computed: {
    clips() {
      return this.$store.state.clips;
    },
  },
  methods: {
    async searchClips({ text }) {
      this.searchText = text;
      await this.fetchClips({ text });
    },
    async fetchClips(params) {
      await this.$store.dispatch("fetchClips", params);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>