// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  app: {
    baseURL: "/valou.github.io/",
  },
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@nuxt/image",
    "@nuxtjs/color-mode",
    "@nuxtjs/tailwindcss",
  ],
  colorMode: {
    preference: "light",
    classSuffix: "",
  },
  tailwindcss: {
    config: {
      darkMode: "class",
    },
  },
  ui: {
    disableGlobalStyles: true,
  },
  runtimeConfig: {
    public: {
      ADMIN_API_KEY: process.env.ADMIN_API_KEY,
      apiBase: process.env.API_BASE_URL,
    },
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  css: ["@fortawesome/fontawesome-svg-core/styles.css"],
  imports: {
    dirs: [
      "composables",
      "composables/*/index.{ts,js,mjs,mts}",
      "composables/**",
    ],
  },
});
