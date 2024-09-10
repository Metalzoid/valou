<script setup>
const route = useRoute();

const toggleDashboardNavbar = ref(true);
const links = ref(null);
const arrowToggle = ref(null);

const windowWidth = ref(null);

const updateWidth = () => {
  windowWidth.value = window.innerWidth;
};

const toggle = () => {
  if (toggleDashboardNavbar.value === true) {
    toggleDashboardNavbar.value = false;
    links.value.style.transform = "translateY(0vw)";
    arrowToggle.value.$el.style.transform = "translateY(0vw)";
  } else {
    toggleDashboardNavbar.value = true;
    links.value.style.transform = "translateY(-7vw)";
    arrowToggle.value.$el.style.transform = "translateY(-7vw)";
  }
};

onMounted(() => {
  updateWidth;
  window.addEventListener("resize", updateWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});
</script>

<template>
  <div class="container">
    <ul class="links" ref="links">
      <NuxtLink
        to="/dashboard"
        :class="{ active: route.fullPath === '/dashboard' }"
        >Mon dashboard</NuxtLink
      >
      <NuxtLink
        to="#reservations"
        :class="{ active: route.fullPath === '/dashboard#reservations' }"
        >Mes réservations</NuxtLink
      >
      <NuxtLink
        to="#services"
        :class="{ active: route.fullPath === '/dashboard#services' }"
        >Mes services</NuxtLink
      >
      <NuxtLink
        to="#clients"
        :class="{ active: route.fullPath === '/dashboard#clients' }"
        >Mes clients</NuxtLink
      >
    </ul>
    <font-awesome-icon
      :icon="['fas', 'arrow-down']"
      class="toggleDashboardNavbar"
      ref="arrowToggle"
      @click="toggle()"
      v-if="windowWidth < '856'"
    />
  </div>
</template>

<style scoped lang="scss">
.container {
  margin: 4rem;
  width: auto;
  display: flex;
  flex-direction: column;
  .links {
    display: flex;
    justify-content: space-evenly;
    background-color: white;
    border-radius: 0.4rem;
    padding: 0.5rem;
    box-shadow: 4px 4px 10px rgba(1, 1, 1, 0.2);
    transition-timing-function: cubic-bezier(10, 2, 3, 1);
    transition: all ease-in-out 0.3s;
    transform: translateY(-0vw);
    a {
      transition: all ease-in-out 0.25s;
      padding: 0.5rem;
      border: 1px solid transparent;
      border-radius: 0.45rem;
      &:hover {
        color: #ed682e;
        box-shadow: 2px 2px 25px rgba(1, 1, 1, 0.12);
      }
    }

    .active {
      color: rgba(237, 104, 46, 1);
    }
    @media only screen and (max-width: 855px) {
      transform: translateY(-7vw);
    }
  }
  .toggleDashboardNavbar {
    background: #f0efef;
    box-shadow: 5px 5px 16px #b4b3b3, -5px -5px 16px #ffffff;
    margin-top: 0.2rem;
    width: 1rem;
    height: 1rem;
    padding: 0.5rem;
    border-radius: 50%;
    margin: -0.5rem auto;
    cursor: pointer;
    transition-timing-function: cubic-bezier(10, 2, 3, 1);

    transition: all ease-in-out 0.3s;
    &:hover {
      border-radius: 150px;
      background: #ebebeb;
      box-shadow: 5px 5px 15px #a3a2a2, -5px -5px 15px #ffffff;
    }
    @media only screen and (max-width: 855px) {
      transform: translateY(-7vw);
    }
  }
}
</style>
