<script setup lang="ts">
import { definePageMeta } from '#imports'
//import { useAuth } from '#auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

// ページのメタ情報を設定
definePageMeta({ auth: false })

// 認証とリダイレクト処理
const { status, data: session } = useAuth()
const router = useRouter()

onMounted(() => {
  console.log(status);
  console.log(session);
  console.log(status.value);
  console.log(session.value);
  console.log(session.value?.user);
  console.log(session.value?.user?.isNewUser);
  // 認証状態が 'authenticated' で、ユーザーが新規ユーザーの場合にリダイレクト
  /*if (status.value === 'authenticated' && session.value?.user?.isNewUser) {
    console.log("router pushed");
    router.push('/account')
  }*/
})
</script>

<template>
  <div>
    <nuxt-link to="/">
      -> manual login, logout, refresh button
    </nuxt-link>
    <br>
    <nuxt-link to="/protected/globally">
      -> globally protected page
    </nuxt-link>
    <br>
    <nuxt-link to="/protected/locally">
      -> locally protected page (only works if global middleware disabled)
    </nuxt-link>
    <br>
    <nuxt-link to="/always-unprotected">
      -> page that is always unprotected
    </nuxt-link>
    <br>
    <nuxt-link to="/guest">
      -> guest mode
    </nuxt-link>
    <br>
    <nuxt-link to="/with-caching">
      -> cached page with swr
    </nuxt-link>
    <br>
    <div>select one of the above actions to get started.</div>
  </div>
</template>
