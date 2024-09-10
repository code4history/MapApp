export default defineNuxtConfig({
  modules: ['@sidebase/nuxt-auth'],
  auth: {
    // 認証の設定（必要に応じてここに追加）
  }
});

//export default {
  /*modules: [
    '@nuxtjs/auth-next'
  ],
  auth: {
    strategies: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
  },*/
//}


