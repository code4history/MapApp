<template>
    <v-btn @click="signIn('google')" type="submit" >Googleでサインイン</v-btn>
</template>

<script lang="ts" setup>
    const { status, data, signIn } = useAuth()
</script>

<style scoped>
</style>