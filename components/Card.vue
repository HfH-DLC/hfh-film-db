<template>
  <div
    class="
      bg-white
      rounded
      shadow
      border border-gray-300
      overflow-hidden
      hover:border-thunderbird-red
      transform
      hover:scale-101 hover:shadow-lg
    "
  >
    <div class="font-bold bg-thunderbird-red text-white p-2">
      # {{ clip["Clip Nr."] }}
    </div>
    <div class="p-4" v-if="clip['Vorschaubild']">
      <img
        :src="clip['Vorschaubild'][0].thumbnails.large.url"
        alt=""
        class="w-full"
      />
    </div>
    <div class="p-4">
      <div class="uppercase text-sm text-gray-600">Behinderung</div>
      <div v-html="behinderung" />
      <div class="uppercase text-sm text-gray-600 mt-4">Thema</div>
      <div v-html="thema" />
      <div class="uppercase text-sm text-gray-600 mt-4">
        Heilpädagogische Relevanz
      </div>
      <div v-html="relevanz" />
      <div class="uppercase text-sm text-gray-600 mt-4">Film</div>
      <div v-html="filmtitel" />
      <div class="uppercase text-sm text-gray-600 mt-4">Keywords</div>
      <div v-html="keywords" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    clip: {
      type: Object,
      required: true,
    },
    searchText: {
      type: String,
      default: "",
    },
  },
  computed: {
    searchWords() {
      return this.searchText ? this.searchText.trim().split(" ") : [];
    },
    behinderung() {
      return this.highlight(this.clip["Behinderung"]);
    },
    thema() {
      return this.highlight(this.clip["Thema"]);
    },
    relevanz() {
      return this.highlight(this.clip["Heilpädagogische Relevanz"]);
    },
    filmtitel() {
      return this.highlight(this.clip["Film_Titel"]);
    },
    keywords() {
      return this.clip["keywords"]
        ? this.highlight(this.clip["keywords"].join(", "))
        : "";
    },
  },
  methods: {
    highlight(content) {
      if (content && this.searchWords.length > 0) {
        this.searchWords.forEach((word) => {
          content = content.replace(new RegExp(word, "gi"), (match) => {
            return '<span class="bg-yellow-400">' + match + "</span>";
          });
        });
      }
      return content;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>