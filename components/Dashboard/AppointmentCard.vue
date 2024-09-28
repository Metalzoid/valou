<script setup>
const { updateData } = useApi();
const { $swal } = useNuxtApp();
const allDatasStore = useAllDatasStore();
const props = defineProps({
  appointment: Object,
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

onMounted(() => {
  setAppointment(props.appointment);
});

watch(
  () => props.appointment,
  (newVal) => {
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
      :services="allDatasStore.allDatas.services"
    />
  </Modal>
  <div
    class="cards flex items-center cursor-pointer"
    @click="updateAppointmentModal = true"
  >
    <div class="w-11/12 flex-col">
      <div class="flex justify-between w-full items-center">
        <h1 class="font-mono text-3xl text-indigo-700">
          {{ appointment.user?.firstname }} {{ appointment?.user?.lastname }}
        </h1>
        <NuxtImg src="/img/profil-manquant.jpg" class="h-12 w-12" />
      </div>
      <UDivider />
      <div
        class="flex justify-between w-full mt-3"
        v-if="props?.appointment?.from === 'dashboard'"
      >
        <h5>
          {{ appointment?.minTime?.toLocaleString() }}
        </h5>
        <h5>
          {{ appointment?.maxTime?.toLocaleString() }}
        </h5>
      </div>
      <div class="flex justify-between w-full mt-3" v-else>
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
