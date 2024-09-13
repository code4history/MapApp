<template>
  <div>
    <form @submit.prevent="register">
      <input v-model="accountName" placeholder="アカウント名を入力" />
      <button type="submit">登録</button>
    </form>
  </div>
</template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from '#imports';
  import { useRouter } from 'vue-router';

  const accountName = ref('');
  const route = useRoute();
  const router = useRouter();

  const register = async () => {
    const callbackUrl = route.query.callbackUrl || '/'; // callbackUrl の取得
    await $fetch('/api/user/register', {
      method: 'POST',
      body: { accountName },
    });
    router.push(decodeURIComponent(callbackUrl as string)); // 登録後に callbackUrl にリダイレクト
  };
</script>