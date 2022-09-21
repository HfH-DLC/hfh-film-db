import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  css: ["@hfh-dlc/hfh-styleguide/dist/style.css", "assets/css/main.css"],
  runtimeConfig: {
    airtableApiKey: "",
    airtableBase: "",
    enableVideo: false,
  },
});
