<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const { login, register } = useApi();

const props = defineProps({
  method: String,
});

const userLogin = reactive({
  email: undefined,
  password: undefined,
});

const uiOptions = {
  label: {
    base: "block font-medium text-gray-200 dark:text-gray-900",
  },
};

const handleSubmit = async () => {
  let result;

  if (["login", "register"].includes(props.method)) {
    const action = props.method === "login" ? login : register;
    result = await action(userLogin.email, userLogin.password);
  }

  if (result && result.success) {
    if (typeof window !== "undefined") {
      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
      sessionStorage.removeItem("redirectAfterLogin");
      return router.push(redirectPath);
    }
  }
};
</script>

<template>
  <h1 class="text-center text-4xl mb-6">Se connecter</h1>
  <UForm
    :state="userLogin"
    @submit="handleSubmit"
    class="form gap-5 flex flex-col w-9/12"
    ref="form"
  >
    <UFormGroup label="Email" :ui="uiOptions">
      <UInput
        placeholder="anthony.bridgerton@example.com"
        icon="i-heroicons-envelope"
        v-model="userLogin.email"
        required
      />
    </UFormGroup>

    <UFormGroup label="Mot de passe actuel" :ui="uiOptions" name="password">
      <UInput
        type="password"
        placeholder="Votre mot de passe"
        icon="i-heroicons-envelope"
        v-model="userLogin.password"
        required
      />
    </UFormGroup>
    <UButton type="submit" class="mt-5">Se connecter</UButton>
  </UForm>
</template>
