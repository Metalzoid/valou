<script setup>
const { deleteData, updateData, getData } = useApi();

const props = defineProps({
  eventsInfos: Object,
});

const emit = defineEmits(["closeEvents", "refetchEvents", "modalTitle"]);

const event = ref({
  id: null,
  title: null,
  start: null,
  end: null,
  status: null,
  customer_id: null,
  price: null,
  comment: null,
  seller_comment: null,
  services: null,
});

const statusOptions = [
  {
    name: "Accepté",
    value: "accepted",
  },
  {
    name: "Annuler",
    value: "canceled",
  },
];

const closeModal = () => {
  emit("closeEvents");
};

const refetchEvents = () => {
  emit("refetchEvents");
};

const isFutureEvent = (endDate) => {
  const endDateTime = new Date(endDate);
  const currentTime = new Date();
  return endDateTime > currentTime;
};

const deleteAvailability = async (id) => {
  try {
    const response = await deleteData(`availabilities/${id}`);
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
      },
    };

    const response = await updateData(
      `appointments/${event.value.id}`,
      appointment
    );
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => props.eventsInfos,
  async (newVal) => {
    if (newVal && newVal.event) {
      event.value = {
        id: newVal.event.id,
        title: newVal.event.title,
        start: newVal.event.start,
        end: newVal.event.end,
        status: newVal.event.extendedProps.status,
        customer: newVal.event.extendedProps.customer,
        price: newVal.event.extendedProps.price,
        comment: newVal.event.extendedProps.comment,
        seller_comment: newVal.event.extendedProps.seller_comment,
        services: newVal.event.extendedProps.services,
      };
    }
  },
  { immediate: true }
);
</script>

<template>
  <h3>Date de début: {{ event.start.toLocaleString("fr-FR") }}</h3>
  <h3 class="my-1">Date de fin: {{ event.end.toLocaleString("fr-FR") }}</h3>
  <p class="my-1" v-if="event.price">Prix: {{ event.price }} €</p>
  <p class="my-1" v-if="event.comment">
    Commentaire du client: {{ event.comment }}
  </p>
  <p class="my-1" v-if="event.seller_comment">
    Votre commentaire: {{ event.seller_comment }}
  </p>
  <h1 v-if="event.services">Prestations:</h1>
  <ul v-for="service in event.services">
    <li>
      - {{ service.title }} • {{ service.time }} minutes - {{ service.price }} €
    </li>
  </ul>
  <USelect
    class="my-1"
    v-model="event.status"
    :options="statusOptions"
    option-attribute="name"
    @change="updateAppointment"
    v-if="isFutureEvent(event.end) && event.status"
  />
  <UButton
    class="mt-5"
    @click="deleteAvailability(event.id)"
    v-if="!event.status"
  >
    Supprimer cette disponibilité
  </UButton>
</template>
