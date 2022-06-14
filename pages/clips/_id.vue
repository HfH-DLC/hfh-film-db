<template>
  <div class="flex flex-col">
    <div v-if="loading" class="flex justify-center items-center flex-1">
      <LoadingIndicator />
    </div>
    <div v-else-if="clip">
      <div class="font-bold bg-thunderbird-red text-white py-4 px-8">
        Clip {{ clip["Clip Nr."] }}
      </div>
      <div class="p-8">
        <img v-if="image" :src="image" alt="" class="w-96 mb-12" />
        <div class="uppercase text-xs font-bold text-thunderbird-red">Link</div>
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
        <div class="uppercase text-xs font-bold text-thunderbird-red mt-4">
          Behinderung
        </div>
        <div>{{ clip.Behinderung }}</div>
        <div class="uppercase text-xs font-bold text-thunderbird-red mt-4">
          Thema
        </div>
        <div>{{ clip.Thema }}</div>
        <div class="uppercase text-xs font-bold text-thunderbird-red mt-4">
          Heilpädagogische Relevanz
        </div>
        <div>{{ clip["Heilpädagogische Relevanz"] }}</div>
        <div class="uppercase text-xs font-bold text-thunderbird-red mt-4">
          Clip-Inhalt
        </div>
        <div>{{ clip["Inhalt"] }}</div>
        <div class="uppercase text-xs font-bold text-thunderbird-red mt-4">
          Länge
        </div>
        <div>{{ secondsToString(clip["Länge"]) }}</div>
        <div class="uppercase text-xs font-bold text-thunderbird-red mt-4">
          Film
        </div>
        <div>{{ clip["Film_Titel"] }}</div>
        <div class="uppercase text-xs font-bold text-thunderbird-red mt-4">
          Inhalt
        </div>
        <div>{{ clip["Film_Inhalt"] }}</div>
        <div class="uppercase text-xs font-bold text-thunderbird-red mt-4">
          Jahr
        </div>
        <div>{{ clip["Film_Jahr"] }}</div>
        <div class="uppercase text-xs font-bold text-thunderbird-red mt-4">
          Land
        </div>
        <div>{{ clip["Film_Land"] }}</div>
        <div class="uppercase text-xs font-bold text-thunderbird-red mt-4">
          Ton
        </div>
        <div>{{ clip["Film_Ton"] }}</div>
        <div class="uppercase text-xs font-bold text-thunderbird-red mt-4">
          Weitere Angaben
        </div>
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
    loading() {
      return this.$store.state.loading;
    },
  },
  methods: {
    secondsToString(seconds) {
      const date = new Date(seconds * 1000);
      let hh = date.getUTCHours();
      let mm = date.getUTCMinutes();
      let ss = date.getSeconds();
      let output = "";
      if (hh != 0) {
        if (hh < 10) {
          hh = "0" + hh;
        }
        output += `${hh}:`;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      output += `${mm}:`;
      if (ss < 10) {
        ss = "0" + ss;
      }
      output += ss;
      return output;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>