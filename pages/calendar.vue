<script setup>
definePageMeta({
  middleware: ["auth"],
});
const user = ref(null);
if (typeof window !== "undefined") {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      user.value = parsedUser.value.user;
    } catch (err) {
      console.error(err);
    }
  }
}
</script>

<template>
  <CalendarClient v-if="user.role === 'client'" />
  <CalendarVendor v-if="user.role === 'vendor'" />
</template>
