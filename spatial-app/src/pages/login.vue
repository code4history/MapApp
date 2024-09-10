<template>
  <div>
    <h1>Login</h1>
    <button @click="loginWithGoogle">Login with Google</button>
  </div>
</template>
    
<script setup>
  const loginWithGoogle = () => {
    window.location.href = '/api/auth/signin/google';
  }
</script>