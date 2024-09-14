<script setup>
const { postData } = useApi();
const { $swal } = useNuxtApp();

const emit = defineEmits(["closeModal"]);

const closeModal = () => {
  emit("closeModal", "addNewService");
};

const props = defineProps({
  method: String,
});

const state = reactive({
  id: undefined,
  title: undefined,
  price: undefined,
  time: undefined,
});

const form = ref();

const createService = () => {
  
}

const onSubmit = async () => {
  form.value.clear();
  let formData = {
    service: {
      title: state.title,
      time: state.time,
      price: state.price,
    },
  };

  const response = await postData("services", formData);

  if (response.success) {
    state.id = response.data.data.id;
    $swal.fire({
      title: "Génial!",
      text: "Prestation crée avec succès",
      icon: "success",
    });
    emit("addNewService", state);
    form.value.clear();
    closeModal();
  } else {
    const errors = Object.entries(response.data.errors).map(
      ([path, message]) => ({
        path: path,
        message: message.isArray() ? message[0] : message,
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
</script>

<template>
  <UForm ref="form" :state="state" @submit="onSubmit">
    <UFormGroup label="Titre de la prestation" name="title" class="mt-5">
      <UInput v-model="state.title" type="text" required />
    </UFormGroup>

    <UFormGroup label="Durée de prestation" name="time" class="mt-3">
      <UInput v-model="state.time" type="number" required />
    </UFormGroup>

    <UFormGroup label="Prix" name="price" class="mt-5">
      <UInput v-model="state.price" type="number" />
    </UFormGroup>

    <UButton type="submit" class="mt-5"> Submit </UButton>
  </UForm>
</template>
