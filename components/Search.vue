<template>
  <form @submit.prevent="search" class="relative">
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
      >Suche</label
    >
    <div class="flex items-center justify-start gap-4">
      <input
        v-model="searchtext"
        id="search"
        type="search"
        class="
          block
          w-48
          border-2 border-thunderbird-red
          placeholder-thunderbird-red
          text-lg
          leading-6
          py-3.5
          px-5
          flex-1
          md:flex-none
        "
        placeholder="Suchbegriff"
      />
      <button
        class="
          bg-black
          text-white
          font-bold
          py-4
          pl-6
          pr-14
          text-left
          leading-6
          appearance-none
          cursor-pointer
          focus:bg-thunderbird-red
          hover:bg-thunderbird-red
          search-icon
        "
        type="submit"
      >
        Suchen
      </button>
    </div>
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

<style scoped>
.search-icon {
  @apply bg-search bg-no-repeat bg-size-search bg-pos-search;
}
.search-icon:hover,
.search-icon:focus {
  @apply bg-search-active;
}
</style>