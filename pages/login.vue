<script setup>
import { ref } from "vue";
import { useNuxtApp } from "#app";

const { $session } = useNuxtApp();

const user = ref({
  email: "",
  password: "",
});

async function handleLogin() {
  await $session.login(user.value.email, user.value.password);
}
async function logout() {
  await $session.logout();
}
</script>

<template>
  <div>
    <div class="title">
      <h2>Login</h2>
    </div>
    <div class="container form">
      <label for="email"><b>Email</b></label>
      <input
        v-model="user.email"
        type="text"
        class="input"
        placeholder="Enter Email"
        name="email"
        required
      />

      <label for="password"><b>Password</b></label>
      <input
        v-model="user.password"
        type="password"
        class="input"
        placeholder="Enter Password"
        name="password"
        required
      />

      <button @click.prevent="handleLogin" class="button">Login</button>
      <button @click.prenvent="logout">test</button>
    </div>
  </div>
</template>
