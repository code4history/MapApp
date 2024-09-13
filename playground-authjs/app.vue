<script setup lang="ts">
  import { ref } from 'vue'
  import { useAsyncData, useAuth, useRequestHeaders, useRoute } from '#imports'

  // Vue 3 の `ref` で reactive なデータを定義
  const opened = ref(false)

  // Auth 関連のロジック
  const { data, status, lastRefreshedAt, getCsrfToken, getProviders, signIn, signOut, getSession } = useAuth()

  const providers = await getProviders()
  const csrfToken = await getCsrfToken()

  // TEMP: Due to a bug in Nuxt `$fetch` (and thus in `useFetch`),
  // we need to transform `undefined` returned from `$fetch` to `null`.
  const { data: token } = await useAsyncData(
    '/api/token',
    async () => {
      const headers = useRequestHeaders(['cookie'])
      const result = await $fetch('/api/token', { headers })
      return result ?? null
    }
  )

  const route = useRoute()

  // アニメーションのメソッド（Vue 3 では関数として定義）
  const beforeEnter = (el: HTMLElement) => {
    el.style.height = '0'
  }

  const enter = (el: HTMLElement) => {
    el.style.height = el.scrollHeight + 'px'
  }

  const beforeLeave = (el: HTMLElement) => {
    el.style.height = el.scrollHeight + 'px'
  }

  const leave = (el: HTMLElement) => {
    el.style.height = '0'
  }
</script>

<template>
  <div class="a-accordion">
    <button @click="opened = !opened">
      Click
    </button>
    <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <div v-if="opened" class="a-accordion-inner">
        <h3>Authentication Overview</h3>
        <p>
          See all available authentication & session information below. Navigate to different sub-pages to test out the app.
        </p>
        <pre>Status: {{ status }}</pre>
        <pre>Data: {{ data || 'no session data present, are you logged in?' }}</pre>
        <pre>Last refreshed at: {{ lastRefreshedAt || 'no refresh happened' }}</pre>
        <pre>Decoded JWT token: {{ token || 'no token present, are you logged in?' }}</pre>
        <pre>CSRF Token: {{ csrfToken }}</pre>
        <pre>Providers: {{ providers }}</pre>
        <hr>
        <h2>Navigation</h2>
        <p>Navigate to different pages below to test out different things:</p>
        <div>
          <nuxt-link to="/api/protected/inline" external>
            -> API endpoint protected inline
          </nuxt-link>
          <br>
          <nuxt-link to="/api/protected/middleware" external>
            -> API endpoint protected middleware
          </nuxt-link>
          <br>
        </div>
        <h2>Actions</h2>
        <p>Take different actions:</p>
        <div>
          <button @click="signIn(undefined, { callbackUrl: '/' })">
            sign in
          </button>
          <br>
          <button @click="signIn('credentials', { callbackUrl: '/', username: 'jsmith', password: 'hunter2' })">
            sign in (credential)
          </button>
          <br>
          <button @click="signIn('github', { callbackUrl: '/' })">
            sign in (github)
          </button>
          <br>
          <button @click="signIn(undefined, { callbackUrl: '/protected/named' })">
            sign in (with redirect to protected page)
          </button>
          <br>
          <button @click="signOut({ callbackUrl: '/signout' })">
            sign out
          </button>
          <br>
          <button @click="getSession({ required: false })">
            refresh session
          </button>
        </div>
        <hr>
      </div>
    </transition>
  </div>
  <div>
    <p>The page content of "{{ route.path }}"</p>
    <NuxtPage />
  </div>
</template>

<style scoped lang="scss">
.a-accordion {
  .a-accordion-inner {
    overflow: hidden; // 閉じるときに他要素に被らないように必須。
    transition: height 0.2s ease-in-out; // 高さの変更に対して連続的に変化させる。
  }
}
</style>
