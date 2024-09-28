<script setup>
const links = [
  {
    to: "yesterday",
    name: "Hier",
  },
  {
    to: "today",
    name: "Aujourd'hui",
  },
  {
    to: "tomorrow",
    name: "Demain",
  },
];

const allDatas = ref(null);
const appointments = ref([]);
const date = ref("today");
const today = ref(0);
const thisWeek = ref(0);

const allDatasStore = useAllDatasStore();

allDatasStore.$subscribe((mutation, state) => {
  allDatas.value = state.allDatas;
});

const updateDateRef = (newDate) => {
  date.value = newDate;
};

const defineAppointments = async (minDate, maxDate) => {
  appointments.value = [];

  allDatas.value.appointments.forEach((app) => {
    if (minDate && maxDate && app.status === "accepted") {
      if (
        new Date(app.start_date) > minDate &&
        new Date(app.end_date) < maxDate
      ) {
        const user = allDatas.value?.customers.find(
          (user) => user.id === app.customer_id
        );
        const appointment = {
          appointment: app,
          user: user,
        };
        appointments.value.push(appointment);
      }
    }
  });
};

const defineAppointmentsNumber = async (minDate, maxDate, destination) => {
  destination.value = 0;

  allDatas.value?.appointments.map((app) => {
    if (minDate && maxDate && app.status === "accepted") {
      if (
        new Date(app.start_date) > minDate &&
        new Date(app.end_date) < maxDate
      ) {
        destination.value += 1;
      }
    }
  });
};

onMounted(async () => {
  await allDatasStore.loadDatas();
  allDatas.value = allDatasStore.allDatas;
  const minDate = new Date();
  minDate.setHours("00", "00", "01");
  const maxDate = new Date();
  maxDate.setHours("23", "59", "59");
  defineAppointments(minDate, maxDate);
  defineAppointmentsNumber(minDate, maxDate, today);
  minDate.setDate(minDate.getDate() + 1);
  maxDate.setDate(maxDate.getDate() + 7);
  defineAppointmentsNumber(minDate, maxDate, thisWeek);
});

watch(
  () => date.value,
  async (newVal) => {
    await allDatasStore.loadDatas();
    if (newVal === "today") {
      const minDate = new Date();
      minDate.setHours("00", "00", "01");
      const maxDate = new Date();
      maxDate.setHours("23", "59", "59");
      defineAppointments(minDate, maxDate);
    } else if (newVal === "yesterday") {
      const minDate = new Date();
      const maxDate = new Date();
      minDate.setDate(minDate.getDate() - 1);
      minDate.setHours("00", "00", "01");
      maxDate.setDate(maxDate.getDate() - 1);
      maxDate.setHours("23", "59", "59");
      defineAppointments(minDate, maxDate);
    } else {
      const minDate = new Date();
      const maxDate = new Date();
      minDate.setDate(minDate.getDate() + 1);
      minDate.setHours("00", "00", "01");
      maxDate.setDate(maxDate.getDate() + 1);
      maxDate.setHours("23", "59", "59");
      defineAppointments(minDate, maxDate);
    }
  }
);
</script>
<template>
  <div class="container w-full">
    <DashboardMiniLinks
      :links="links"
      :date="date"
      @updateDateRef="updateDateRef"
    />
    <div
      v-for="appointment in appointments"
      v-if="appointments.length > 0"
      :key="appointment.id"
      class="w-full"
    >
      <DashboardAppointmentCard :appointment="appointment" />
    </div>
    <h3
      style="width: 30vw"
      class="mt-5 text-center text-xl"
      v-if="appointments.length == 0"
    >
      Pas de rendez-vous !
    </h3>
  </div>
  <UDivider orientation="vertical" />
  <div class="flex flex-col gap-5 w-5/12">
    <div>
      <h3 class="text-3xl mt-8 text-nowrap text-indigo-700">Vos rendez-vous</h3>
      <UDivider />
    </div>
    <div class="flex w-100 justify-around mt-3 flex-wrap gap-5">
      <DashboardMiniCard title="Aujourd'hui" :content="today" />
      <DashboardMiniCard title="7 prochains jours" :content="thisWeek" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.container {
  display: flex;
  width: 35vw;
  flex-direction: column;
  margin-top: 2rem;
  gap: 2rem;
}
</style>
