<template>
  <div class="flex flex-col">
    <div v-if="loading" class="flex justify-center items-center flex-1">
      <LoadingIndicator />
    </div>
    <div v-else-if="clip">
      <h2 class="font-bold bg-thunderbird-red text-white py-4 px-8">
        Clip {{ clip["Clip Nr."] }}
      </h2>
      <div class="p-8">
        <iframe
          class="w-[640px] mb-8 aspect-video bg-black"
          v-if="clip['Vimeo-Link']"
          title="vimeo-player"
          :src="`https://player.vimeo.com/video/${videoUrlFragment1}?h=${videoUrlFragment2}`"
          frameborder="0"
          allowfullscreen
        ></iframe>
        <img v-else-if="image" :src="image" alt="" class="w-96 mb-8" />
        <h2 class="text-lg text-thunderbird-red">Informationen zum Clip</h2>
        <DetailSection label="Behinderung">
          {{ clip.Behinderung }}
        </DetailSection>
        <DetailSection label="Thema">
          {{ clip.Thema }}
        </DetailSection>
        <DetailSection label="Heilpädagogische Relevanz">
          {{ clip["Heilpädagogische Relevanz"] }}
        </DetailSection>
        <DetailSection label="Inhalt">
          {{ clip.Inhalt }}
        </DetailSection>
        <DetailSection label="Länge">
          {{ clipLength }}
        </DetailSection>
        <DetailSection label="Schlüsselwörter">
          {{ keywords }}
        </DetailSection>
        <hr class="mt-6 mb-4 border-thunderbird-red" />
        <h2 class="text-lg text-thunderbird-red">
          Informationen zu den Personen mit Behinderung
        </h2>
        <DetailSection label="Herkunft">
          {{ origin }}
        </DetailSection>
        <DetailSection label="Altersgruppen">
          {{ age }}
        </DetailSection>
        <DetailSection label="Geschlecht">
          {{ gender }}
        </DetailSection>
        <hr class="mt-6 mb-4 border-thunderbird-red" />
        <h2 class="text-lg text-thunderbird-red">Informationen zum Film</h2>
        <DetailSection label="Titel">
          {{ clip["Film_Titel"] }}
        </DetailSection>
        <DetailSection label="Inhalt">
          {{ clip["Film_Inhalt"] }}
        </DetailSection>
        <DetailSection label="Jahr">
          {{ clip["Film_Jahr"] }}
        </DetailSection>
        <DetailSection label="Land">
          {{ clip["Film_Land"] }}
        </DetailSection>
        <DetailSection label="Ton">
          {{ clip["Film_Ton"] }}
        </DetailSection>
        <DetailSection label="Weitere Angaben">
          {{ clip["Film_Weitere_Angaben"] }}
        </DetailSection>
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
    videoUrlFragment1() {
      return this.clip["Vimeo-Link"].split("/")[3];
    },
    videoUrlFragment2() {
      return this.clip["Vimeo-Link"].split("/")[4];
    },
    image() {
      return this.clip && this.clip["Vorschaubild"]
        ? this.clip["Vorschaubild"][0].thumbnails.large.url
        : null;
    },
    clipLength() {
      return this.clip && this.clip["Länge"]
        ? this.secondsToString(this.clip["Länge"])
        : "";
    },
    keywords() {
      return this.clip["keywords"] ? this.clip["keywords"].join(", ") : "";
    },
    origin() {
      return this.clip["Herkunft behinderte Person"]
        ? this.clip["Herkunft behinderte Person"].join(", ")
        : "";
    },
    age() {
      return this.clip["Altersgruppe behinderte Person"]
        ? this.clip["Altersgruppe behinderte Person"].join(", ")
        : "";
    },
    gender() {
      return this.clip["Geschlecht behinderte Person"]
        ? this.clip["Geschlecht behinderte Person"].join(", ")
        : "";
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