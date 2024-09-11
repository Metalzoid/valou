<script setup>
definePageMeta({
  middleware: ["auth"],
});

const userStore = useUserStore();
onMounted(() => {
  userStore.loadUserFromSession();
});
</script>
<template>
  <InfosProfil :user="userStore.currentUser" />
</template>
<style lang="scss" scoped></style>
