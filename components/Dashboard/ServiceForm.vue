<script setup>
const { postData, updateData } = useApi();
const { $swal } = useNuxtApp();

const emit = defineEmits(["closeModal", "updateService"]);

const closeModal = () => {
  emit("closeModal", "addNewService");
};

const props = defineProps({
  method: String,
  service: Object,
});

const state = reactive({
  id: undefined,
  title: undefined,
  price: undefined,
  time: undefined,
});

const form = ref();

const renderSubmit = (response, method) => {
  if (response.success) {
    state.id = response.data.data.id;
    $swal.fire({
      title: "Génial!",
      text: `Prestation ${
        method === "create" ? "crée" : "mise à jour"
      } avec succès`,
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

const onSubmit = async () => {
  form.value.clear();
  let formData = {
    service: {
      title: state.title,
      time: state.time,
      price: state.price,
    },
  };
  if (props.method === "create") {
    const response = await postData("services", formData);
    renderSubmit(response, props?.method);
  } else {
    const response = await updateData(`services/${state.id}`, formData);
    renderSubmit(response, props?.method);
    emit("updateService", state);
  }
};

watch(
  () => props?.service,
  (newVal) => {
    Object.assign(state, newVal);
  },
  { immediate: true }
);
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
