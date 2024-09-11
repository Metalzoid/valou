<script setup>
definePageMeta({
  middleware: ["auth"],
});

const links = [
  { to: "/dashboard", fullpath: "/dashboard", name: "Dashboard" },
  {
    to: "#reservations",
    fullpath: "/dashboard#reservations",
    name: "Réservations",
  },
  { to: "#services", fullpath: "/dashboard#services", name: "Services" },
  { to: "#clients", fullpath: "/dashboard#clients", name: "Clients" },
];
</script>

<template>
  <NavBarDashboard :links="links" />
</template>
