export default defineNuxtConfig({
  ssr: true,  // SSR が必要な場合
  modules: ["@sidebase/nuxt-auth"],
  auth: {
    globalAppMiddleware: true, // サイト全体で認証を必要にする
  }
});