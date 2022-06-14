<template>
  <div
    class="
      border-2 border-fantasy-plain
      overflow-hidden
      hover:bg-thunderbird-red hover:text-white hover:border-thunderbird-red
      group-focus-visible:bg-thunderbird-red
      group-focus-visible:text-white
      group-focus-visible:border-thunderbird-red
      group
    "
  >
    <div class="bg-fantasy-plain">
      <div
        class="aspect-video bg-cover"
        :style="{
          backgroundImage: backgroundImage(clip),
        }"
      ></div>
    </div>
    <div class="group-hover:text-white pt-4 px-4 text-lg">
      Clip {{ clip["Clip Nr."] }}
    </div>
    <div class="p-4 gap-4 grid">
      <CardSection label="Behinderung" :content="behinderung" />
      <CardSection label="Thema" :content="thema" />
      <CardSection label="Heilpädagogische Relevanz" :content="relevanz" />
      <CardSection label="Film" :content="filmtitel" />
      <CardSection label="Keywords" :content="keywords" />
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
    backgroundImage(clip) {
      if (
        clip["Vorschaubild"] &&
        clip["Vorschaubild"][0] &&
        clip["Vorschaubild"][0].thumbnails &&
        clip["Vorschaubild"][0].thumbnails.large &&
        clip["Vorschaubild"][0].thumbnails.large.url
      ) {
        return "url(" + clip["Vorschaubild"][0].thumbnails.large.url + ")";
      }
      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
</style>