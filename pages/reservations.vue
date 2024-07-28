<script setup>
const { $session, $api } = useNuxtApp();
await $session.redirect_to_login();

async function get_data() {
  event.preventDefault();
  const response = await $api.get.show_appointment(39);
}

async function post_data() {
  event.preventDefault();
  const response = await $api.post.new_availability({
    availability: {
      start_date: "05/07/2024 12:00",
      end_date: "06/07/2024 15:00",
      available: "true",
    },
  });
}
</script>
<template>
  <h1>reservations</h1>
  <button @click="post_data()">coucou</button>
</template>
