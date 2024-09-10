<template>
  <div v-if="session">
    <h1>Welcome, {{ session.user.name }}</h1>
    <button @click="logout">Logout</button>
  </div>
</template>
  
<script setup>
  import { useFetch } from '#app';
  
  const { data: session, refresh } = await useFetch('/api/auth/session');
  
  const logout = async () => {
    await useFetch('/api/auth/signout');
    refresh();
  }
</script>