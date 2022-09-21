<template>
  <div class="pb-8">
    <HfhHeaderBar>
      <template v-slot:right>
        <HfhMenu :items="menuItems" variant="tertiary" />
      </template>
    </HfhHeaderBar>
    <div class="mx-4 xl:max-w-container xl:mx-auto">
      <HfhLink
        href="/"
        :useDefaultStyles="false"
        class="inline-flex gap-x-4 mt-12 mb-12 items-center"
      >
        <HfhLogo />
        <div class="text-2xl mb-[3px]">Filmclip-Datenbank</div>
      </HfhLink>
    </div>
    <div class="mx-4 xl:max-w-container xl:mx-auto">
      <slot />
    </div>
  </div>
</template>

<script setup>
import {
  HfhHeaderBar,
  HfhMenu,
  HfhLogo,
  HfhLink,
} from "@hfh-dlc/hfh-styleguide";
const menuItems = [
  { label: "hfh.ch", link: { href: "https://hfh.ch", target: "_blank" } },
];
</script>

<style lang="scss" scoped>
</style>