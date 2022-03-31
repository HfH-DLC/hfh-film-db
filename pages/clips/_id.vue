<template>
  <div>
    <h1 class="text-2xl block p-4 text-thunderbird-red">Filmclips</h1>
    <div v-if="clip">
      <div class="font-bold bg-thunderbird-red text-white p-4">
        # {{ clip["Clip Nr."] }}
      </div>
      <div class="p-4">
        <img v-if="image" :src="image" alt="" class="w-96 mb-4" />
        <div class="uppercase text-sm text-gray-600">Link</div>
        <div>
          <a
            :href="clip['Vimeo-Link']"
            class="text-thunderbird-red hover:underline"
            target="_blank"
            noreferrer
            noopener
            >{{ clip["Vimeo-Link"] }}</a
          >
        </div>
        <div class="uppercase text-sm text-gray-600 mt-4">Behinderung</div>
        <div>{{ clip.Behinderung }}</div>
        <div class="uppercase text-sm text-gray-600 mt-4">Thema</div>
        <div>{{ clip.Thema }}</div>
        <div class="uppercase text-sm text-gray-600 mt-4">
          Heilpädagogische Relevanz
        </div>
        <div>{{ clip["Heilpädagogische Relevanz"] }}</div>
        <div class="uppercase text-sm text-gray-600 mt-4">Clip-Inhalt</div>
        <div>{{ clip.Clipinhalt }}</div>
        <div class="uppercase text-sm text-gray-600 mt-4">Länge</div>
        <div>{{ clip.Cliplänge }}</div>
        <div class="uppercase text-sm text-gray-600 mt-4">Film</div>
        <div>{{ clip["Film_Titel"] }}</div>
        <div class="uppercase text-sm text-gray-600 mt-4">Inhalt</div>
        <div>{{ clip["Film_Inhalt"] }}</div>
        <div class="uppercase text-sm text-gray-600 mt-4">Jahr</div>
        <div>{{ clip["Film_Jahr"] }}</div>
        <div class="uppercase text-sm text-gray-600 mt-4">Land</div>
        <div>{{ clip["Film_Land"] }}</div>
        <div class="uppercase text-sm text-gray-600 mt-4">Ton</div>
        <div>{{ clip["Film_Ton"] }}</div>
        <div class="uppercase text-sm text-gray-600 mt-4">Weitere Angaben</div>
        <div>{{ clip["Film_Weitere_Angaben"] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async fetch() {
    await this.$store.dispatch("fetchClip", this.$route.params.id);
  },
  computed: {
    clip() {
      return this.$store.getters.clipById(this.$route.params.id);
    },
    image() {
      return this.clip && this.clip["Vorschaubild"]
        ? this.clip["Vorschaubild"][0].thumbnails.large.url
        : null;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>