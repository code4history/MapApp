const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',  // server-app のアドレス
        changeOrigin: true
      },
      '/_nuxt': {
        target: 'http://localhost:3000/',  // server-app のアドレス
        changeOrigin: true
      }
    },
  }
})
