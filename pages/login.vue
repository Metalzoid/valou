<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
const { login, logout, register } = useApi();

const handleLogin = async () => {
  const result = await login(email.value, password.value);
};

const handleRegister = async () => {
  const result = await register(
    email.value,
    password.value,
    firstname.value,
    lastname.value,
    role.value,
    company.value
  );
};
</script>

<template>
  <div class="flex justify-center flex-col items-center">
    <form @submit.prevent="handleLogin" class="flex flex-col w-6/12">
      <label for="email">Email: </label>
      <input
        v-model="email"
        type="email"
        id="email"
        placeholder="Email"
        required
      />
      <label for="password">Password: </label>
      <input
        v-model="password"
        type="password"
        id="password"
        placeholder="Password"
        required
      />
      <button
        type="submit"
        class="mt-3 inline-block rounded bg-primary pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 w-1/12"
      >
        Login
      </button>
    </form>
    <button
      @click="logout"
      class="mt-3 inline-block rounded bg-primary pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3"
    >
      Logout
    </button>
  </div>
  <div class="flex justify-center items-center flex-col">
    <form @submit.prevent="handleRegister" class="flex flex-col w-6/12">
      <label for="email">Email: </label>
      <input
        v-model="email"
        type="email"
        id="email"
        placeholder="Your Email."
        required
      />
      <label for="password">Password: </label>
      <input
        v-model="password"
        type="password"
        id="password"
        placeholder="Your Password."
        required
      />
      <label for="firstname">Firstname: </label>
      <input
        type="text"
        v-model="firstname"
        id="firstname"
        placeholder="Your firstname."
        required
      />
      <label for="lastname">Lastname: </label>
      <input
        type="text"
        v-model="lastname"
        id="lastname"
        placeholder="Your lastname."
        required
      />
      <label for="role">Role: </label>
      <select v-model="role" id="role" required>
        <option value="seller">Seller</option>
        <option value="customer">Customer</option>
        <option value="both">Both</option>
      </select>
      <label for="company">Your company</label>
      <input
        type="text"
        v-model="company"
        id="company"
        placeholder="Your company name."
      />

      <button
        type="submit"
        class="mt-3 inline-block rounded bg-primary pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 w-1/12"
      >
        Register
      </button>
    </form>
  </div>
</template>
