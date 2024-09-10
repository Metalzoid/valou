<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const email2 = ref("");
const password2 = ref("");
const firstname = ref("");
const lastname = ref("");
const role = ref("customer");
const company = ref("");
const router = useRouter();

const { login, logout, register } = useApi();

const handleLogin = async () => {
  const result = await login(email.value, password.value);

  if (result && result.success) {
    if (typeof window !== "undefined") {
      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
      sessionStorage.removeItem("redirectAfterLogin");
      return router.push(redirectPath);
    }
  }
};

const handleRegister = async () => {
  await register(
    email2.value,
    password2.value,
    firstname.value,
    lastname.value,
    role.value,
    company.value
  );
};
</script>

<template>
  <div class="place-content-center min-h-screen">
    <h1 class="text-center text-4xl mb-6">Se connecter</h1>
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
    </div>
    <div class="flex justify-center items-center flex-col">
      <form @submit.prevent="handleRegister" class="flex flex-col w-6/12">
        <label for="email">Email: </label>
        <input
          v-model="email2"
          type="email"
          id="email2"
          placeholder="Your Email."
          required
        />
        <label for="password">Password: </label>
        <input
          v-model="password2"
          type="password"
          id="password2"
          placeholder="Your Password."
          required
        />
        <button
          type="submit"
          class="mt-3 inline-block rounded bg-primary pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 w-1/12"
        >
          Register
        </button>
      </form>
    </div>
  </div>
</template>
