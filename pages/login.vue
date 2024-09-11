<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const userLogin = reactive({
  email: undefined,
  password: undefined,
});
const router = useRouter();

const uiOptions = {
  label: {
    base: "block font-medium text-gray-200 dark:text-gray-900",
  },
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <LoginForm method="login" />
  </div>
</template>
