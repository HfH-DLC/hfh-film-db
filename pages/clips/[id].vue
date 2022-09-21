<template>
  <div class="flex flex-col">
    <div v-if="clip">
      <h1 class="max-w-content mx-auto mb-6 lg:mb-10">
        Clip {{ clip["Clip Nr."] }}
      </h1>
      <div>
        <iframe
          class="max-w-container mx-auto w-full mb-4 aspect-video bg-black"
          v-if="clip['Vimeo-Link']"
          title="vimeo-player"
          :src="`https://player.vimeo.com/video/${videoUrlFragment1}?h=${videoUrlFragment2}`"
          frameborder="0"
          allowfullscreen
        ></iframe>
        <img
          v-else-if="image"
          :src="image"
          alt=""
          class="max-w-container mx-auto w-full mb-4"
        />
        <div class="max-w-content mx-auto">
          <h2 class="mt-6 lg:mt-8">Informationen zum Clip</h2>
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
          <h2 class="mt-6 lg:mt-8">
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
          <h2 class="mt-6 lg:mt-8">Informationen zum Film</h2>
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
  </div>
</template>

<script setup>
const { fetchClip, clips } = useClips();
const route = useRoute();

const clip = computed(() =>
  clips.value.find((clip) => clip.id == route.params.id)
);

const videoUrlFragment1 = computed(() => {
  return clip.value["Vimeo-Link"].split("/")[3];
});

const videoUrlFragment2 = computed(() => {
  return clip.value["Vimeo-Link"].split("/")[4];
});

const image = computed(() => {
  return clip && clip.value["Vorschaubild"]
    ? clip.value["Vorschaubild"][0].thumbnails.large.url
    : null;
});

const clipLength = computed(() => {
  return clip && clip.value["Länge"]
    ? secondsToString(clip.value["Länge"])
    : "";
});

const keywords = computed(() => {
  return clip.value["keywords"] ? clip.value["keywords"].join(", ") : "";
});

const origin = computed(() => {
  return clip.value["Herkunft behinderte Person"]
    ? clip.value["Herkunft behinderte Person"].join(", ")
    : "";
});

const age = computed(() => {
  return clip.value["Altersgruppe behinderte Person"]
    ? clip.value["Altersgruppe behinderte Person"].join(", ")
    : "";
});
const gender = computed(() => {
  return clip.value["Geschlecht behinderte Person"]
    ? clip.value["Geschlecht behinderte Person"].join(", ")
    : "";
});

const secondsToString = (seconds) => {
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
};

useAsyncData(async () => {
  await fetchClip(route.params.id);
});
</script>

<style lang="scss" scoped>
</style>