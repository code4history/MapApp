export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: ["@sidebase/nuxt-auth"],
  auth: {
    provider: {
      type: 'authjs'
    },
    globalAppMiddleware: {
      isEnabled: true
    },
    baseURL: `http://localhost:${process.env.PORT || 3000}`
  },
  routeRules: {
    '/with-caching': {
      swr: 86400000,
      auth: {
        disableServerSideAuth: true
      }
    }
  }
})
