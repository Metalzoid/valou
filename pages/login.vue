<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
const { login } = useLogin();
const { logout } = useLogout();

const handleLogin = async () => {
  const result = await login(email.value, password.value);
};
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Login</button>
  </form>
  <button @click="logout">Logout</button>
</template>
