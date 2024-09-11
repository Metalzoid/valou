<script setup>
const { updateData } = useApi();
const userStore = useUserStore();
const { $swal } = useNuxtApp();

const uiOptions = {
  label: {
    base: "block font-medium text-gray-200 dark:text-gray-900",
  },
};

const form = ref(null);
const togglePassword = ref(false);

const errorPaths = {
  current_password: "currentPassword",
  password: "newPassword",
  password_confirmation: "newPasswordConfirmation",
};

const translatePaths = {
  current_password: "Votre mot de passe",
};

const translateMessages = {
  "is invalid": "est invalide.",
  "User has been updated.": "Votre profil à bien été mis à jour.",
};

const currentUser = reactive({
  id: undefined,
  email: undefined,
  firstname: undefined,
  lastname: undefined,
  company: undefined,
  role: undefined,
  currentPassword: undefined,
  newPassword: undefined,
  newPasswordConfirmation: undefined,
});

const userDataAreDifferent = computed(() => {
  const keys = [
    "firstname",
    "lastname",
    "email",
    "company",
    "newPassword",
    "newPasswordConfirmation",
  ];
  if (currentUser && userStore.currentUser) {
    return keys.some((key) => currentUser[key] !== userStore.currentUser[key]);
  }
});

const newPasswordsAreDifferent = computed(() => {
  return currentUser.newPassword !== currentUser.newPasswordConfirmation;
});

const onSubmit = async () => {
  let formData = {
    user: {
      firstname: currentUser.firstname,
      lastname: currentUser.lastname,
      company: currentUser.company,
      current_password: currentUser.currentPassword,
      ...(currentUser.newPassword ? { password: currentUser.newPassword } : {}),
      ...(currentUser.newPasswordConfirmation
        ? { password_confirmation: currentUser.newPasswordConfirmation }
        : {}),
    },
  };

  const response = await updateData("signup", formData);

  if (response.success) {
    userStore.setUser(JSON.parse(JSON.stringify(currentUser)));
    $swal.fire({
      title: "Génial !",
      text: translateMessages[response.data.message],
      icon: "success",
    });
    form.value.clear();
  } else {
    const errors = Object.entries(response.data.errors).map(
      ([path, message]) => ({
        path: errorPaths[path] ? errorPaths[path] : path,
        message: translateMessages[message[0]]
          ? `${translatePaths[path]} ${translateMessages[message[0]]}`
          : message[0],
      })
    );

    form.value.setErrors(errors);
    errors.forEach((err) => {
      $swal.fire({
        title: "Une erreur est survenue!",
        text: err.message,
        icon: "error",
      });
    });
  }
};

onMounted(() => {
  const user = userStore.loadUserFromSession();
  if (user) {
    Object.assign(currentUser, user);
  }
});
</script>
<template>
  <div class="container">
    <div class="main">
      <h1 class="text-3xl">Vos informations</h1>
      <NuxtImg src="/img/profil-manquant.jpg" class="h-32 w-32 profil-img" />
      <UForm
        :state="currentUser"
        @submit="onSubmit"
        class="form gap-5 flex flex-col"
        v-if="currentUser"
        ref="form"
      >
        <UFormGroup label="Email" :ui="uiOptions">
          <UInput
            placeholder="anthony.bridgerton@example.com"
            icon="i-heroicons-envelope"
            v-model="currentUser.email"
            required
          />
        </UFormGroup>
        <div class="flex justify-between gap-5 flex-wrap">
          <UFormGroup label="Prénom" :ui="uiOptions" class="flex-auto">
            <UInput
              placeholder="Anthony"
              v-model="currentUser.firstname"
              required
            />
          </UFormGroup>
          <UFormGroup label="Nom de famille" :ui="uiOptions" class="flex-auto">
            <UInput
              placeholder="Bridgerton"
              v-model="currentUser.lastname"
              required
            />
          </UFormGroup>
        </div>
        <UFormGroup label="Votre entreprise" :ui="uiOptions" class="flex-auto">
          <UInput v-model="currentUser.company" />
        </UFormGroup>
        <div>
          <UButton
            class="mt-5"
            @click="togglePassword = !togglePassword"
            v-if="!togglePassword"
            >Modifier le mot de passe</UButton
          >
          <div class="flex justify-between gap-5" v-if="togglePassword">
            <UFormGroup
              label="Nouveau mot de passe"
              class="flex-auto"
              :ui="uiOptions"
              v-slot="{ error }"
              :error="
                newPasswordsAreDifferent && 'Mot de passe non identique !'
              "
            >
              <UInput
                type="password"
                icon="i-heroicons-envelope"
                v-model="currentUser.newPassword"
                :trailing-icon="
                  error
                    ? 'i-heroicons-exclamation-triangle-20-solid'
                    : undefined
                "
                required
                :class="{
                  'border-red-500 dark:bg-gray-900 rounded-md':
                    newPasswordsAreDifferent,
                  'border-gray-300 dark:bg-gray-900 rounded-md':
                    !newPasswordsAreDifferent,
                }"
              />
            </UFormGroup>
            <UFormGroup
              label="Confirmation"
              class="flex-auto"
              :ui="uiOptions"
              v-slot="{ error }"
              :error="
                newPasswordsAreDifferent && 'Mot de passe non identique !'
              "
            >
              <UInput
                type="password"
                icon="i-heroicons-envelope"
                v-model="currentUser.newPasswordConfirmation"
                :trailing-icon="
                  error
                    ? 'i-heroicons-exclamation-triangle-20-solid'
                    : undefined
                "
                required
                :class="{
                  'border-red-500 dark:bg-gray-900 rounded-md':
                    newPasswordsAreDifferent,
                  'border-gray-300 dark:bg-gray-900 rounded-md':
                    !newPasswordsAreDifferent,
                }"
              />
            </UFormGroup>
          </div>
        </div>

        <div>
          <UFormGroup
            label="Mot de passe actuel"
            :ui="uiOptions"
            name="currentPassword"
            v-if="userDataAreDifferent"
          >
            <UInput
              type="password"
              placeholder="Votre mot de passe actuel..."
              icon="i-heroicons-envelope"
              v-model="currentUser.currentPassword"
              required
              :class="{
                'border-red-500 dark:bg-gray-900 rounded-md':
                  newPasswordsAreDifferent,
                'border-gray-300 dark:bg-gray-900 rounded-md':
                  !newPasswordsAreDifferent,
              }"
            />
          </UFormGroup>
          <UButton type="submit" class="mt-5" :disabled="!userDataAreDifferent"
            >Modifier vos informations</UButton
          >
        </div>
      </UForm>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.container {
  margin: 4rem;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    gap: 1rem;
    width: 75vw;
    border-radius: 0.4rem;
    padding: 0.5rem;
    box-shadow: 4px 4px 10px rgba(1, 1, 1, 0.2);
    transition-timing-function: cubic-bezier(10, 2, 3, 1);
    transition: all ease-in-out 0.3s;
    transform: translateY(-0vw);
    .form {
      width: 50vw;
      @media only screen and (max-width: 835px) {
      }
      ::placeholder {
        color: rgb(182, 182, 182);
      }

    }
  }
}
</style>
