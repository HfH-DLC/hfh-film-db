<template>
  <HfhHeaderBar>
    <template v-slot:right>
      <HfhMenu :items="menuItems" variant="tertiary" />
    </template>
  </HfhHeaderBar>
  <div class="mx-4 xl:max-w-container xl:mx-auto">
    <NuxtLink to="/" class="inline-flex gap-x-4 mt-12 mb-12 items-center">
      <HfhLogo />
      <div class="text-2xl mb-[3px]">Filmclip-Datenbank</div>
    </NuxtLink>
  </div>
  <div class="mx-4 pb-20 xl:max-w-container xl:mx-auto">
    <slot />
  </div>
  <HfhFooter>
    <template #tagline
      ><p>wissenschaftsbasiert, praxisorientiert, breit verankert</p></template
    >
    <template #contact-address
      ><p>
        Schaffhauserstrasse 239<br />Postfach 5850<br />CH-8050 Zürich
      </p></template
    >
    <template #contact-other>
      <p>T +41 44 317 11 11</p>
      <p><a href="mailto:info@hfh.ch">info@hfh.ch</a></p>
    </template>
    <template #socials>
      <HfhSocialBlock icon="facebook" href="https://www.facebook.com/hfh.edu" />
      <HfhSocialBlock
        icon="youtube"
        href="https://www.youtube.com/user/hfhzuerich"
      />
      <HfhSocialBlock
        icon="linkedin"
        href="https://www.linkedin.com/company/hfh.edu"
      />
      <HfhSocialBlock
        icon="instagram"
        href="https://www.instagram.com/hfh_edu/"
      />
      <HfhSocialBlock icon="twitter" href="https://twitter.com/hfh_edu" />
      <HfhSocialBlock
        icon="issuu"
        href="https://issuu.com/hochschule_fuer_heilpaedagogik"
      />
    </template>
    <template #copyright> © Copyright 2022 HfH </template>
  </HfhFooter>
</template>

<script setup>
import {
  HfhFooter,
  HfhHeaderBar,
  HfhMenu,
  HfhLogo,
  HfhLink,
  HfhSocialBlock,
} from "@hfh-dlc/hfh-styleguide";
const menuItems = [
  { label: "hfh.ch", link: { href: "https://hfh.ch", target: "_blank" } },
];
</script>

<style lang="scss" scoped>
</style>