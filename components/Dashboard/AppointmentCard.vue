<script setup>
const { updateData } = useApi();
const { $swal } = useNuxtApp();
const allDatasStore = useAllDatasStore();
const props = defineProps({
  appointment: Object,
  services: Object,
});

const updateAppointmentModal = ref(false);

const closeAppointmentModal = () => {
  updateAppointmentModal.value = false;
};

const appointment = ref({
  minTime: null,
  maxTime: null,
  minutes: null,
  user: null,
  comment: null,
  status: null,
});

const setAppointment = (data) => {
  const minTime = new Date(data.appointment.start_date);
  appointment.value.minTime = minTime;
  const maxTime = new Date(data.appointment.end_date);
  appointment.value.maxTime = maxTime;
  appointment.value.minutes = (maxTime - minTime) / 60000;
  appointment.value.user = data.user;
  appointment.value.comment = data.appointment.comment;
  appointment.value.status = data.appointment.status;
};

const toggleCard = ref(false);

const updateAppointment = async (newStatus) => {
  const appointment = {
    appointment: {
      status: newStatus,
    },
  };
  const response = await updateData(
    `appointments/${props.appointment.appointment.id}`,
    appointment
  );

  console.log(response);

  if (response.success) {
    allDatasStore.updateDatas();
    $swal.fire({
      title: "Génial!",
      text: `Réservation mise à jour avec succès.`,
      icon: "success",
    });
  }
};

onMounted(() => {
  setAppointment(props.appointment);
});

watch(
  () => props.appointment,
  (newVal) => {
    toggleCard.value = false;
    setAppointment(newVal);
  }
);
</script>

<template>
  <Modal
    :isOpen="updateAppointmentModal"
    :title="`Rendez-vous avec ${appointment?.user?.firstname} ${appointment?.user?.lastname}`"
    @update:isOpen="(value) => (updateAppointmentModal = value)"
  >
    <DashboardAppointmentForm
      @closeModal="closeAppointmentModal"
      method="update"
      :appointment="props.appointment"
      :services="props.services"
    />
  </Modal>
  <div class="cards flex items-center">
    <div class="w-11/12 flex-col">
      <div class="flex justify-between w-full items-start">
        <h1 class="font-mono text-3xl text-indigo-700">
          {{ appointment.user?.firstname }} {{ appointment?.user?.lastname }}
        </h1>
        <NuxtImg src="/img/profil-manquant.jpg" class="h-12 w-12" />
      </div>
      <div class="w-full" v-if="appointment.comment">
        <h4>Commentaire client:</h4>
        <p>{{ appointment.comment }}</p>
      </div>
      <UDivider />
      <div
        class="flex justify-between w-full"
        v-if="props?.appointment?.from === 'dashboard'"
      >
        <h5>
          {{ appointment?.minTime?.toLocaleString() }}
        </h5>
        <h5>
          {{ appointment?.maxTime?.toLocaleString() }}
        </h5>
      </div>
      <div class="flex justify-between w-full" v-else>
        <h5>
          {{ appointment?.minTime?.toLocaleTimeString().substring(0, 5) }}
          <font-awesome-icon
            :icon="['fas', 'caret-right']"
            style="color: #b3b3b3"
          />
          {{ appointment?.maxTime?.toLocaleTimeString().substring(0, 5) }}
        </h5>
        <p>
          <font-awesome-icon :icon="['fas', 'clock']" style="color: #c9c9c9" />
          {{ appointment?.minutes }} minutes
        </p>
        <p>{{ appointment?.user?.phone_number }}</p>
      </div>
    </div>
    <div class="toggle">
      <font-awesome-icon
        :icon="['fas', 'chevron-right']"
        size="2xl"
        color="#B0B0B0"
        @click="toggleCard = !toggleCard"
      />
    </div>
    <div v-if="toggleCard" class="flex flex-col gap-3">
      <div v-if="appointment.status === 'hold'">
        <h3
          class="text-green-700 cursor-pointer"
          @click="updateAppointment('accepted')"
        >
          Accepter
        </h3>
        <h3
          class="text-red-700 cursor-pointer"
          @click="updateAppointment('refused')"
        >
          Refuser
        </h3>
      </div>
      <div v-else>
        <h3 class="cursor-pointer" @click="updateAppointmentModal = true">
          Modifier
        </h3>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.cards {
  display: flex;
  background-color: white;
  margin-bottom: 2rem;
  min-width: max-content;
  padding: 1rem;
  border-radius: 1rem;
  gap: 1rem;
  box-shadow: 4px 4px 10px rgba(1, 1, 1, 0.2);
  &:hover {
    transform: scale(1.007);
  }
  .toggle {
    opacity: 0;
    transition: all ease-in-out 0.4s;
    cursor: pointer;
  }
  &:hover {
    .toggle {
      opacity: 1;
    }
  }
}
</style>
