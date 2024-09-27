<script setup>
import { useRoute } from "vue-router";
definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();

const allDatas = ref(null);

const allDatasStore = useAllDatasStore();

allDatasStore.$subscribe((mutation, state) => {
  allDatas.value = state.allDatas;
});

const chipNumberHold = ref(0);

const isFutureEvent = (endDate) => {
  const endDateTime = new Date(endDate);
  const currentTime = new Date();
  return endDateTime > currentTime;
};

const updateChipNumberAppointments = () => {
  const appointments = allDatas.value.appointments;
  const filteredAppointments = appointments.filter(
    (app) => app.status === "hold" && isFutureEvent(app.end_date)
  );
  chipNumberHold.value = filteredAppointments.length;
};

const links = ref([
  {
    to: "/dashboard",
    fullpath: ["/dashboard"],
    name: "Dashboard",
  },
  {
    to: "?reservations",
    fullpath: ["/dashboard?reservations"],
    name: "Réservations",
    chipNumber: chipNumberHold.value,
  },
  {
    to: "?prestations",
    fullpath: ["/dashboard?prestations"],
    name: "Prestations",
  },
  { to: "?clients", fullpath: ["/dashboard?clients"], name: "Clients" },
]);

onMounted(async () => {
  await allDatasStore.loadDatas();
  allDatas.value = allDatasStore.allDatas;
  updateChipNumberAppointments(allDatas);
  links.value = [
    {
      to: "/dashboard",
      fullpath: ["/dashboard"],
      name: "Dashboard",
    },
    {
      to: "?reservations",
      fullpath: ["/dashboard?reservations"],
      name: "Réservations",
      chipNumber: chipNumberHold.value,
    },
    {
      to: "?prestations",
      fullpath: ["/dashboard?prestations"],
      name: "Prestations",
    },
    { to: "?clients", fullpath: ["/dashboard?clients"], name: "Clients" },
  ];
});
</script>

<template>
  <NavBarDashboard :links :width="'75'" />
  <div
    id="mainDashboard"
    class="flex h-full flex-wrap justify-center gap-5"
    v-if="route?.fullPath === '/dashboard'"
  >
    <DashboardMainDashboard />
  </div>
  <div
    class="flex h-full flex-wrap justify-center gap-5"
    v-if="route?.fullPath === '/dashboard?prestations'"
  >
    <DashboardServicesDashboard />
  </div>
  <div
    class="flex h-full flex-wrap justify-center gap-5"
    v-if="route?.fullPath === '/dashboard?reservations'"
  >
    <DashboardAppointmentsDashboard />
  </div>
</template>
<style lang="scss" scoped>
#mainDashboard {
  transition: all 0.4s ease-in-out;
  @media only screen and (max-width: 855px) {
    margin-top: 5rem;
  }
}
</style>
