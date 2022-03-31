<template>
  <form @submit.prevent="search">
    <label class="block uppercase text-sm text-gray-600 pl-0.5" for="search"
      >Suche</label
    >
    <input
      v-model="searchtext"
      id="search"
      type="search"
      class="
        mt-1
        border border-gray-300
        rounded
        p-2
        focus:outline-none focus:ring-1 focus:ring-thunderbird-red
      "
    />
    <button class="bg-black text-white font-bold px-4 py-2 ml-4" type="submit">
      Suchen
    </button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      searchtext: "",
    };
  },
  methods: {
    search() {
      this.$emit("submit", { text: this.searchtext });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>