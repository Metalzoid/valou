// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  css: ["@fortawesome/fontawesome-svg-core/styles.css"],
  imports: {
    dirs: [
      "composables",
      "composables/*/index.{ts,js,mjs,mts}",
      "composables/**",
    ],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || "/api",
    },
  },
});
