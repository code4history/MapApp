// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    public: {
      googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true }
})
