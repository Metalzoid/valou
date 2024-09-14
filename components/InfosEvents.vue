<script setup>
const { deleteData, updateData, getUserByID } = useApi();
const { $swal } = useNuxtApp();

const props = defineProps({
  eventsInfos: Object,
});

const emit = defineEmits(["closeEvents", "refetchEvents", "modalTitle"]);

const toggleForm = ref(false);

const toggleCommentForm = ref(false);

const form = ref();

const statusOptions = [
  {
    name: "Accepté",
    value: "accepted",
  },
  {
    name: "Annuler ?",
    value: "canceled",
  },
];

const event = ref({
  type: null,
  id: null,
  title: null,
  start: null,
  end: null,
  available: null,
  status: null,
  customer: null,
  price: null,
  comment: null,
  seller_comment: null,
  services: null,
});

const formatDate = (date) => {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const closeModal = () => {
  emit("closeEvents");
};

const getUserInfos = async (id) => {
  try {
    const response = await getUserByID(id);
    if (response.success) {
      const user = response.data.data;
      return {
        user_id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        company: user.company,
        role: user.role,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

const refetchEvents = () => {
  emit("refetchEvents");
};

const isFutureEvent = (endDate) => {
  const endDateTime = new Date(endDate);
  const currentTime = new Date();
  return endDateTime > currentTime;
};

const deleteAvailability = async () => {
  try {
    const response = await deleteData(`availabilities/${event.value.id}`);
    if (response.success) {
      refetchEvents();
      closeModal();
    }
  } catch (error) {
    console.log(error);
  }
};

const updateAppointment = async () => {
  try {
    const appointment = {
      appointment: {
        status: event.value.status,
        seller_comment: event.value.seller_comment,
      },
    };

    const response = await updateData(
      `appointments/${event.value.id}`,
      appointment
    );
    if (response.success) {
      await $swal.fire({
        title: "Génial !",
        text: "Mise à jour réussie.",
        icon: "success",
      });
      refetchEvents();
      closeModal();
    }
  } catch (error) {
    $swal.fire({
      title: "Une erreur est survenue!",
      text: error,
      icon: "error",
    });
  }
};

const openFormUpdateAvailability = () => {
  toggleForm.value = true;
};

const updateAvailability = async () => {
  form.value.clear();
  let formData = {
    availability: {
      start_date: event.value.start,
      end_date: event.value.end,
      available: event.value.available,
    },
  };

  const response = await updateData(
    `availabilities/${event.value.id}`,
    formData
  );

  if (response.success) {
    await $swal.fire({
      title: "Génial !",
      text: "Mise à jour réussie.",
      icon: "success",
    });
    form.value.clear();
    closeModal();
    refetchEvents();
  } else {
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

watch(
  () => props.eventsInfos,
  async (newVal) => {
    if (newVal && newVal.event) {
      event.value = {
        type: newVal.event.extendedProps.type,
        id: newVal.event.id,
        title: newVal.event.title,
        start: formatDate(newVal.event.start),
        end: formatDate(newVal.event.end),
        available: newVal.event.extendedProps.available,
        status: newVal.event.extendedProps.status,
        customer: await getUserInfos(newVal.event.extendedProps.customer_id),
        price: newVal.event.extendedProps.price,
        comment: newVal.event.extendedProps.comment,
        seller_comment: newVal.event.extendedProps.seller_comment,
        services: newVal.event.extendedProps.services,
      };
      console.log(newVal.event?.extendedProps.type);

      if (newVal?.event?.extendedProps.type === "appointment") {
        emit(
          "modalTitle",
          `Votre rendez-vous avec ${event.value.customer.firstname} ${event.value.customer.lastname}`
        );
      } else if (newVal?.event?.extendedProps.type === "availability") {
        emit("modalTitle", "Votre disponibilité");
      } else {
        emit("modalTitle", "Votre indisponibilité");
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="!toggleForm && !toggleCommentForm">
    <UFormGroup label="Date de début" name="start_date" class="">
      <UInput
        v-model="event.start"
        :model-value="event.start"
        type="datetime-local"
        disabled
      />
    </UFormGroup>
    <UFormGroup label="Date de début" name="start_date" class="mt-5">
      <UInput
        v-model="event.end"
        :model-value="event.end"
        type="datetime-local"
        disabled
      />
    </UFormGroup>
    <UDivider class="my-3"></UDivider>
    <p class="my-1" v-if="event.price">Prix: {{ event.price }} €</p>
    <p class="my-1" v-if="event.comment">
      Commentaire du client: {{ event.comment }}
    </p>
    <p class="my-1" v-if="event.seller_comment">
      Votre commentaire: {{ event.seller_comment }}
    </p>
    <UButton
      @click="toggleCommentForm = true"
      class="my-3"
      v-if="event.type == 'appointment'"
      >{{
        event.seller_comment
          ? "Modifier votre commentaire"
          : "Laisser un commentaire"
      }}</UButton
    >
    <UDivider class="my-3" v-if="event.type == 'appointment'"></UDivider>
    <h1 v-if="event.services">Prestations:</h1>
    <ul v-for="service in event.services" :key="service.id">
      <li>
        - {{ service.title }} • {{ service.time }} minutes -
        {{ service.price }} €
      </li>
    </ul>
    <UDivider class="my-3" v-if="event.services"></UDivider>
    <USelect
      class="my-5"
      v-model="event.status"
      :options="statusOptions"
      option-attribute="name"
      @change="updateAppointment"
      v-if="isFutureEvent(event.end) && event.status"
    />
    <div class="mt-5 flex justify-around flex-wrap gap-3">
      <UButton
        @click="openFormUpdateAvailability()"
        v-if="
          ['availability', 'unavailability'].includes(event.type) &&
          isFutureEvent(event.end)
        "
        >Modifier cette disponibilité ?</UButton
      >
      <UButton
        @click="deleteAvailability(event.id)"
        v-if="['availability', 'unavailability'].includes(event.type)"
      >
        Supprimer cette disponibilité
      </UButton>
    </div>
  </div>

  <div v-if="toggleForm">
    <UForm ref="form" @submit="updateAvailability">
      <UFormGroup label="Date de début" name="start_date" class="mt-5">
        <UInput
          v-model="event.start"
          :model-value="event.start"
          type="datetime-local"
          required
        />
      </UFormGroup>

      <UFormGroup label="Date de fin" name="end_date" class="mt-3">
        <UInput v-model="event.end" type="datetime-local" required />
      </UFormGroup>

      <UFormGroup label="Disponible ?" name="available" class="mt-3">
        <UToggle v-model="event.available" />
      </UFormGroup>

      <div class="gap-5 flex">
        <UButton type="submit" class="mt-5">Modifier</UButton>
        <UButton class="mt-5" @click="toggleForm = false">Annuler</UButton>
      </div>
    </UForm>
  </div>

  <div v-if="toggleCommentForm">
    <h3>Votre commentaire :</h3>
    <UTextarea
      v-model="event.seller_comment"
      class="mt-3 mb-10"
      autoresize
    ></UTextarea>
    <div class="flex gap-3 flex-wrap">
      <UButton @click="updateAppointment">Enregistrer</UButton>
      <UButton @click="toggleCommentForm = false">Annuler</UButton>
    </div>
  </div>
</template>
