<script setup>
import { useRoute } from "vue-router";
definePageMeta({
  middleware: ["auth"],
});

const { getData } = useApi();

const route = useRoute();

const links = [
  {
    to: "/dashboard",
    fullpath: ["/dashboard"],
    name: "Dashboard",
  },
  {
    to: "?reservations",
    fullpath: ["/dashboard?reservations"],
    name: "Réservations",
  },
  { to: "?services", fullpath: ["/dashboard?services"], name: "Services" },
  { to: "?clients", fullpath: ["/dashboard?clients"], name: "Clients" },
];

const allDatas = await getData("user_datas");
</script>

<template>
  <NavBarDashboard :links :width="'75'" />
  <div
    class="flex h-full flex-wrap justify-center gap-5"
    v-if="route.fullPath === '/dashboard'"
  >
    <DashboardMainDashboard :allDatas="allDatas.data.data" />
  </div>
  <div
    class="flex h-full flex-wrap justify-center gap-5"
    v-if="route.fullPath === '/dashboard?services'"
  >
    <DashboardServicesDashboard :allDatas="allDatas.data.data" />
  </div>
</template>
