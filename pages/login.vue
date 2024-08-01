<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const { login, logout } = useSession();
const router = useRouter();

const handleLogin = async () => {
  const result = await login(email.value, password.value);
  if (result.success) {
    if (typeof window !== "undefined") {
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");
      return router.push(redirectPath);
    }
  }
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
