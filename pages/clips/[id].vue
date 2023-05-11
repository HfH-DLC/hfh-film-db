<template>
  <div class="flex flex-col">
    <NuxtLink href="/" class="hfh-link hfh-link--default mb-8">Zurück</NuxtLink>
    <div v-if="clip">
      <h1 class="max-w-content mx-auto mb-6 lg:mb-10">
        Clip {{ clip[FIELDNAMES.CLIP] }}
      </h1>
      <div>
        <iframe
          class="max-w-container mx-auto w-full mb-4 aspect-video bg-black"
          v-if="clip[FIELDNAMES.VIDEO]"
          title="vimeo-player"
          :src="videoUrl"
          frameborder="0"
          allowfullscreen
        ></iframe>
        <img
          v-else-if="imageUrl"
          :src="imageUrl"
          alt=""
          class="max-w-container mx-auto w-full mb-4"
        />
        <div class="max-w-content mx-auto">
          <h2 class="mt-6 lg:mt-8 hfh-h2">Informationen zum Clip</h2>
          <DetailSection label="Behinderung">
            {{ clip[FIELDNAMES.BEHINDERUNG] }}
          </DetailSection>
          <DetailSection label="Thema">
            {{ clip[FIELDNAMES.THEMA] }}
          </DetailSection>
          <DetailSection label="Heilpädagogische Relevanz">
            {{ clip[FIELDNAMES.RELEVANZ] }}
          </DetailSection>
          <DetailSection label="Inhalt">
            {{ clip[FIELDNAMES.INHALT] }}
          </DetailSection>
          <DetailSection label="Startzeit">
            {{ startingTime }}
          </DetailSection>
          <DetailSection label="Länge">
            {{ clipLength }}
          </DetailSection>
          <DetailSection label="Schlüsselwörter">
            {{ joinArray(clip[FIELDNAMES.KEYWORDS]) }}
          </DetailSection>
          <h2 class="mt-6 lg:mt-8 hfh-h2">
            Informationen zu den Personen mit Behinderung
          </h2>
          <DetailSection label="Herkunft">
            {{ joinArray(clip[FIELDNAMES.HERKUNFT]) }}
          </DetailSection>
          <DetailSection label="Altersgruppen">
            {{ joinArray(clip[FIELDNAMES.ALTERSGRUPPE]) }}
          </DetailSection>
          <DetailSection label="Geschlecht">
            {{ joinArray(clip[FIELDNAMES.GESCHLECHT]) }}
          </DetailSection>
          <h2 class="mt-6 lg:mt-8 hfh-h2">Informationen zum Film</h2>
          <DetailSection label="Titel">
            {{ clip[FIELDNAMES.FILM_TITEL] }}
          </DetailSection>
          <DetailSection label="Inhalt">
            {{ clip[FIELDNAMES.FILM_INHALT] }}
          </DetailSection>
          <DetailSection label="Jahr">
            {{ clip[[FIELDNAMES.FILM_JAHR]] }}
          </DetailSection>
          <DetailSection label="Land">
            {{ joinArray(clip[FIELDNAMES.FILM_LAND]) }}
          </DetailSection>
          <DetailSection label="Ton">
            {{ joinArray(clip[FIELDNAMES.FILM_TON]) }}
          </DetailSection>
          <DetailSection label="Weitere Angaben">
            {{ clip[FIELDNAMES.FILM_WEITERE_ANGABEN] }}
          </DetailSection>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { secondsToString } from "../../helpers";
import { FIELDNAMES } from "../../consts";

const { fetchClip, clips } = useClips();
const route = useRoute();

useAsyncData(async () => {
  await fetchClip(route.params.id);
});

const clip = computed(() =>
  clips.value.find((clip) => clip.id == route.params.id)
);

const videoUrl = computed(() => {
  const path = clip.value[FIELDNAMES.VIDEO].split("/")[3];
  const query = clip.value[FIELDNAMES.VIDEO].split("/")[4];
  return `https://player.vimeo.com/video/${path}?h=${query}`;
});

const imageUrl = computed(() => {
  return clip && clip.value[FIELDNAMES.BILD]
    ? clip.value[FIELDNAMES.BILD][0].thumbnails.large.url
    : null;
});

const startingTime = computed(() => {
  return clip && clip.value[FIELDNAMES.STARTZEIT]
    ? secondsToString(clip.value[FIELDNAMES.STARTZEIT])
    : "";
});

const clipLength = computed(() => {
  return clip && clip.value[FIELDNAMES.LAENGE]
    ? secondsToString(clip.value[FIELDNAMES.LAENGE])
    : "";
});

const joinArray = (array) => {
  if (array) {
    return array.join(", ");
  }
  return "";
};
</script>

<style lang="scss" scoped></style>
