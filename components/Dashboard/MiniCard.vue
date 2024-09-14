<script setup>
const props = defineProps({
  title: String,
  content: Number,
});
</script>
<template>
  <div class="card" v-if="props.title">
    <h2 class="font-mono text-xl">{{ props.title }}</h2>
    <p class="font-mono text-3xl text-center text-indigo-700">
      {{ props.content }}
    </p>
  </div>
</template>
<style lang="scss" scoped>
.card {
  margin: 0 auto;
  height: fit-content;
  background-color: white;
  padding: 1rem 2rem;
  border-radius: 1rem;
  box-shadow: 4px 4px 10px rgba(1, 1, 1, 0.2);
}
</style>
