<script setup>
const props = defineProps({
  link: String,
});
</script>
<template>
  <NuxtLink :to="link"><slot /></NuxtLink>
</template>
