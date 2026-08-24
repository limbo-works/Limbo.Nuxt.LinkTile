<template>
	<main class="redirect-page" aria-label="Opening LinkTile examples"></main>
</template>

<script setup lang="ts">
await navigateTo('/home', { redirectCode: 302 });
</script>

<style>
.redirect-page {
	min-height: 100vh;
}
</style>
