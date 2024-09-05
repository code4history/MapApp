// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/auth-next' // authモジュール
  ],
  axios: {
    baseURL: 'http://localhost:3000', // APIサーバーのベースURL
  },
  auth: {
    strategies: {
      google: {
        clientId: 'YOUR_GOOGLE_CLIENT_ID', // Google OAuth クライアントIDを設定
        codeChallengeMethod: '',
        responseType: 'token id_token',
        redirectUri: 'http://localhost:3000/login', // Googleに戻るURLを設定
      },
      github: {
        clientId: 'YOUR_GITHUB_CLIENT_ID', // GitHub OAuth クライアントID
        clientSecret: 'YOUR_GITHUB_CLIENT_SECRET',
      },
      twitter: {
        clientId: 'YOUR_TWITTER_CLIENT_ID', // Twitter OAuth クライアントID
        clientSecret: 'YOUR_TWITTER_CLIENT_SECRET',
      }
    },
    redirect: {
      login: '/login',   // ログインが必要な場合のリダイレクト先
      logout: '/',       // ログアウト後のリダイレクト先
      callback: '/login', // OAuthのコールバックURL
      home: '/'          // ログイン後のリダイレクト先
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true }
})
