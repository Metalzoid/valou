<script setup>
const { postData } = useApi();
const { $swal } = useNuxtApp();

const emit = defineEmits(["closeModal", "refetchEvents"]);

const props = defineProps({
  selectedDates: Object,
});

const toggleHourly = ref(false);

const closeModal = () => {
  emit("closeModal");
};

const refetchEvents = () => {
  emit("refetchEvents");
};

const state = reactive({
  start_date: undefined,
  end_date: undefined,
  available: true,
  hourly_min: undefined,
  hourly_max: undefined,
});

const form = ref();

watch(
  () => props.selectedDates,
  (newVal) => {
    if (newVal) {
      state.start_date = newVal.start.slice(0, 16);
      state.end_date = newVal.end.slice(0, 16);
    }
  },
  { immediate: true }
);

const onSubmit = async () => {
  let formData = {
    availability: {
      start_date: state.start_date,
      end_date: state.end_date,
      available: state.available,
    },
  };

  if (state.hourly_min && state.hourly_max) {
    const min_hour = state.hourly_min.split(":")[0];
    const min_minutes = state.hourly_min.split(":")[1];
    const max_hour = state.hourly_max.split(":")[0];
    const max_minutes = state.hourly_max.split(":")[1];

    formData.time = {
      min_hour: min_hour,
      min_minutes: min_minutes,
      max_hour: max_hour,
      max_minutes: max_minutes,
    };
  }

  const response = await postData("availabilities", formData);

  if (response.success) {
    $swal.fire({
      title: "Génial!",
      text: response.data.message,
      icon: "success",
    });
    form.value.clear();
    closeModal();
    refetchEvents();
  } else {
    const errors = Object.entries(response.data.errors).map(
      ([path, message]) => ({
        path: path == "start_time" ? "hourly_min" : path,
        message: message[0],
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
    <UFormGroup label="Date de début" name="start_date" class="mt-5">
      <UInput v-model="state.start_date" type="datetime-local" required />
    </UFormGroup>

    <UFormGroup label="Date de fin" name="end_date" class="mt-3">
      <UInput v-model="state.end_date" type="datetime-local" required />
    </UFormGroup>

    <UFormGroup label="Disponible ?" name="available" class="mt-3">
      <UToggle v-model="state.available" />
    </UFormGroup>

    <UFormGroup label="Optionnel" name="available" class="mt-3">
      <UToggle v-model="toggleHourly" />
    </UFormGroup>

    <div v-if="toggleHourly">
      <UFormGroup label="Horaire minimum" name="hourly_min" class="mt-5">
        <UInput v-model="state.hourly_min" type="time" />
      </UFormGroup>

      <UFormGroup label="Horaire maximum" name="hourly_max" class="mt-5">
        <UInput v-model="state.hourly_max" type="time" />
      </UFormGroup>
    </div>

    <UButton type="submit" class="mt-5"> Submit </UButton>
  </UForm>
</template>
