<script setup>
definePageMeta({
  middleware: ["auth"],
});

const userStore = useUserStore();
const user = ref("");

onMounted(() => {
  userStore.loadUserFromSession();
  user.value = userStore.currentUser;
});
</script>

<template>
  <CalendarCustomer v-if="user.role === 'customer'" />
  <CalendarSeller v-if="user.role === 'seller'" />
</template>
