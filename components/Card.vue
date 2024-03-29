<template>
  <HfhTeaser
    :imageSrc="imageSrc"
    imageAlt=""
    :title="title"
    :link="`/clips/${clip.id}`"
    :linkComponent="linkComponent"
  >
    <template v-slot:title>
      <span v-html="highlightedTitle"></span>
    </template>
    <div class="gap-4 grid">
      <CardSection label="Behinderung" :content="behinderung" />
      <CardSection label="Thema" :content="thema" />
      <CardSection label="Heilpädagogische Relevanz" :content="relevanz" />
      <CardSection label="Film" :content="filmtitel" />
      <CardSection label="Schlüsselwörter" :content="keywords" />
    </div>
  </HfhTeaser>
</template>

<script>
import { markRaw } from "vue";
import { HfhTeaser } from "@hfh-dlc/hfh-styleguide";
import { NuxtLink } from "#components";
export default {
  components: {
    HfhTeaser,
  },
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
  data() {
    return {
      linkComponent: markRaw(NuxtLink),
    };
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
    imageSrc() {
      if (
        this.clip["Vorschaubild"] &&
        this.clip["Vorschaubild"][0] &&
        this.clip["Vorschaubild"][0].thumbnails &&
        this.clip["Vorschaubild"][0].thumbnails.large &&
        this.clip["Vorschaubild"][0].thumbnails.large.url
      ) {
        return this.clip["Vorschaubild"][0].thumbnails.large.url;
      }
      return "";
    },
    title() {
      return `Clip ${this.clip["Clip Nr."]}`;
    },
    highlightedTitle() {
      return this.highlight(this.title);
    },
  },
  methods: {
    highlight(content) {
      if (content && this.searchWords.length > 0) {
        this.searchWords.forEach((word) => {
          content = content.replace(new RegExp(word, "gi"), (match) => {
            return (
              '<span class="bg-yellow-400 text-black">' + match + "</span>"
            );
          });
        });
      }
      return content;
    },
  },
};
</script>

<style lang="scss" scoped></style>
