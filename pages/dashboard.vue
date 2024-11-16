<script setup>
import { corePlugins } from "#tailwind-config";
import { useRoute } from "vue-router";
definePageMeta({
  middleware: ["auth"],
});

const props = defineProps(["chipNumberAppointmentHolded"]);

const route = useRoute();

const chipNumber = computed(() => props.chipNumberAppointmentHolded);

const links = computed(() => [
  {
    to: "/dashboard",
    fullpath: ["/dashboard"],
    name: "Dashboard",
  },
  {
    to: "?reservations",
    fullpath: ["/dashboard?reservations"],
    name: "Réservations",
    chipNumber: chipNumber.value,
  },
  {
    to: "?prestations",
    fullpath: ["/dashboard?prestations"],
    name: "Prestations",
  },
  { to: "?clients", fullpath: ["/dashboard?clients"], name: "Clients" },
]);
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
    <DashboardAppointmentsDashboard :chipNumberAppointmentHolded="chipNumber" />
  </div>
  <div
    class="flex h-full flex-wrap justify-center gap-5"
    v-if="route?.fullPath === '/dashboard?clients'"
  >
    <DashboardCustomersDashboard />
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
